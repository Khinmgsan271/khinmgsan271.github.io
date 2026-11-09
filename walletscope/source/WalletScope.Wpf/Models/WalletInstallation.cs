namespace WalletScope.Models;
/// <summary>Non-sensitive local installation metadata or a clearly labeled fictional demonstration record.</summary>
public sealed record WalletInstallation(
    string WalletName,
    string AppType,
    string Browser,
    string BrowserProfile,
    DateTime? SampleDate,
    string Status
);
