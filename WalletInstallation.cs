namespace WalletScope.Models;
/// <summary>A fictional demonstration record; never read from a real wallet or device.</summary>
public sealed record WalletInstallation(
    string WalletName,
    string AppType,
    string Browser,
    string BrowserProfile,
    DateTime SampleDate,
    string Status
);