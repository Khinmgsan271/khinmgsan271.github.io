using WalletScope.Models;
namespace WalletScope.Services;
/// <summary>Static synthetic records. No registry, filesystem, browser or wallet access.</summary>
public static class DemoInventory {
    public static IReadOnlyList<WalletInstallation> GetSampleRows() =>
    [
        new("Phantom", "Browser extension", "Chrome", "Example Profile A", new(2026,5,12), "Installed"),
        new("MetaMask", "Browser extension", "Firefox", "Example Profile B", new(2026,6,2), "Installed"),
        new("Exodus", "Desktop app", "—", "—", new(2026,6,22), "Not installed"),
        new("Rabby", "Browser extension", "Edge", "Example Profile C", new(2026,7,8), "Installed"),
        new("Trust Wallet", "Browser extension", "Chrome", "Example Profile D", new(2026,8,15), "Not installed"),
        new("Coinbase Wallet", "Browser extension", "Chrome", "Example Profile E", new(2026,9,1), "Installed"),
        new("Brave Wallet", "Browser feature", "Brave", "Example Profile F", new(2026,10,3), "Installed")
    ];
}