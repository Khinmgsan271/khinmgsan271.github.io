using Microsoft.Win32;
using WalletScope.Models;

namespace WalletScope.Services;

/// <summary>
/// Consent-based, local-only inventory of explicitly allowlisted wallet software.
/// Reads known browser-extension directory existence and Windows uninstall metadata.
/// NEVER reads extension contents, browser settings, credentials, wallet data,
/// running processes, private keys, seed phrases, balances, or addresses.
/// No networking, telemetry, persistence, or elevated permissions.
/// </summary>
public static class LocalWalletInventory
{
    private sealed record ExtensionSignature(string Name, string Id);
    private sealed record BrowserSignature(string Label, string Folder);
    private static readonly ExtensionSignature[] KnownExtensions =
    [
        new("Phantom", "bfnaelmomeimhlpmgjnjophhpkkoljpa"),
        new("MetaMask", "nkbihfbeogaeaoehlefnkodbefgpgknn"),
        new("Coinbase Wallet", "hnfanknocfeofbddgcijnmhnfnkdnaad"),
        new("Rabby", "acmacodkjbdgmoleebolmdjonilkdbch"),
        new("Trust Wallet", "egjidjbpglichdcondbcbdnbeeppgdph")
    ];
    private static readonly BrowserSignature[] Browsers =
    [
        new("Chrome", Path.Combine("Google", "Chrome", "User Data")),
        new("Edge", Path.Combine("Microsoft", "Edge", "User Data")),
        new("Brave", Path.Combine("BraveSoftware", "Brave-Browser", "User Data"))
    ];
    private static readonly string[] DesktopWalletNames = ["Exodus", "Atomic Wallet", "Ledger Live"];

    public static IReadOnlyList<WalletInstallation> Scan()
    {
        // Called ONLY by explicit user click. Do not run automatically on startup.
        var rows = new List<WalletInstallation>();
        ScanKnownBrowserFolders(rows);
        ScanUninstallEntries(rows);
        return rows.OrderBy(x => x.WalletName, StringComparer.OrdinalIgnoreCase)
                   .ThenBy(x => x.Browser, StringComparer.OrdinalIgnoreCase)
                   .ThenBy(x => x.BrowserProfile, StringComparer.OrdinalIgnoreCase)
                   .ToArray();
    }

    private static void ScanKnownBrowserFolders(List<WalletInstallation> rows)
    {
        string? localData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        if (string.IsNullOrWhiteSpace(localData)) return;
        foreach (var browser in Browsers)
        {
            string root = Path.Combine(localData, browser.Folder);
            if (!Directory.Exists(root)) continue;
            // Only enumerate immediate standard profile directories. Never open their contents
            // beyond checking for exact allowlisted extension-ID directory existence.
            var profileNames = new List<string> { "Default" };
            try
            {
                profileNames.AddRange(Directory.EnumerateDirectories(root, "Profile *", SearchOption.TopDirectoryOnly)
                    .Select(Path.GetFileName).OfType<string>().Order(StringComparer.OrdinalIgnoreCase).Take(20));
            }
            catch (UnauthorizedAccessException) { }
            catch (IOException) { }
            foreach (string profile in profileNames.Distinct(StringComparer.OrdinalIgnoreCase))
            {
                string extensions = Path.Combine(root, profile, "Extensions");
                foreach (var signature in KnownExtensions)
                {
                    string target = Path.Combine(extensions, signature.Id);
                    bool exists = Directory.Exists(target);
                    DateTime? approximateDate = null;
                    if (exists)
                    {
                        try { approximateDate = Directory.GetCreationTime(target); }
                        catch (UnauthorizedAccessException) { }
                        catch (IOException) { }
                    }
                    rows.Add(new WalletInstallation(signature.Name, "Browser extension",
                        browser.Label, profile, approximateDate,
                        exists ? "Installed" : "Not installed"));
                }
            }
        }
    }

    private static void ScanUninstallEntries(List<WalletInstallation> rows)
    {
        var detected = new Dictionary<string, DateTime?>(StringComparer.OrdinalIgnoreCase);
        foreach (var hive in new[] { RegistryHive.CurrentUser, RegistryHive.LocalMachine })
        {
            foreach (var view in new[] { RegistryView.Registry64, RegistryView.Registry32 })
            {
                try
                {
                    using var baseKey = RegistryKey.OpenBaseKey(hive, view);
                    using var uninstall = baseKey.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall", writable: false);
                    if (uninstall == null) continue;
                    foreach (string name in uninstall.GetSubKeyNames().Take(4000))
                    {
                        try
                        {
                            using var item = uninstall.OpenSubKey(name, writable: false);
                            string displayName = item?.GetValue("DisplayName") as string ?? "";
                            string? wallet = DesktopWalletNames.FirstOrDefault(w =>
                                displayName.Equals(w, StringComparison.OrdinalIgnoreCase)
                                || displayName.StartsWith(w + " ", StringComparison.OrdinalIgnoreCase));
                            if (wallet is null) continue;
                            DateTime? date = ParseInstallDate(item?.GetValue("InstallDate") as string);
                            if (!detected.ContainsKey(wallet) || (date.HasValue && !detected[wallet].HasValue))
                                detected[wallet] = date;
                        }
                        catch (UnauthorizedAccessException) { }
                        catch (IOException) { }
                        catch (System.Security.SecurityException) { }
                    }
                }
                catch (UnauthorizedAccessException) { }
                catch (IOException) { }
                catch (System.Security.SecurityException) { }
                catch (PlatformNotSupportedException) { }
            }
        }
        foreach (var wallet in DesktopWalletNames)
        {
            bool installed = detected.TryGetValue(wallet, out var installDate);
            rows.Add(new WalletInstallation(wallet, "Desktop app", "—", "—",
                installed ? installDate : null, installed ? "Installed" : "Not installed"));
        }
    }

    private static DateTime? ParseInstallDate(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw) || raw.Length != 8) return null;
        return DateTime.TryParseExact(raw, "yyyyMMdd",
            System.Globalization.CultureInfo.InvariantCulture,
            System.Globalization.DateTimeStyles.None, out var date) ? date : null;
    }
}
