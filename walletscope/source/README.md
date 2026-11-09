# WalletScope — Local Windows Wallet Software Inventory

**Status:** Original, AI-assisted portfolio prototype, **not a client delivery**. The static HTML demo is tested; the Windows-specific app requires Windows build and runtime validation.

## What it does

- Starts with fictional records; **does not scan automatically**.
- Has a user-initiated **Scan this PC** button and a separate confirmation dialog.
- Checks only exact allowlisted extension-ID *directory existence* for Chrome, Edge and Brave, and reads directory creation metadata if available. No extension file contents are opened.
- Reads the Windows installed-programs/uninstall **DisplayName** and optional **InstallDate** for a small allowlist (Exodus, Atomic Wallet, Ledger Live).
- Displays wallet name, installation status, browser, generic profile directory label (Default, Profile 1, etc.) and approximate date metadata.
- Supports search, status filters and user-controlled local CSV export.

## Privacy and consent

This self-audit tool is intended only for a PC the user owns or administers. It **never** reads or transmits wallet extension contents, wallet app files, transactions, seed phrases, private keys, passwords, browser history, wallet addresses or balances. It doesn't connect to wallets, inspect processes, require admin permissions or send any network requests.

A real scan occurs only after an explicit button click **and** confirmation dialog; the results remain in memory until the application closes. CSV files are created **only** when the user selects a path in the save dialog. The public browser demo is 100% fictional and cannot scan anything.

**Limitations:** An extension folder may remain after an extension is disabled. Directory creation times and Windows installation dates can be missing, approximate or inaccurate. Only a limited allowlist and standard browser profiles are checked. Portable installations and some alternative browsers may be missed. This is not an antivirus tool or wallet security assessment.

## Build and run on Windows

Requires Windows 10/11 and .NET 8 SDK for building:

    dotnet build WalletScope.Wpf/WalletScope.Wpf.csproj -c Release
    dotnet run --project WalletScope.Wpf/WalletScope.Wpf.csproj

To package a self-contained single-file Windows x64 executable:

    dotnet publish WalletScope.Wpf/WalletScope.Wpf.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -o dist/win-x64

Do not run on systems you do not own or administer. Inspect source and test the compiled Windows application before depending on it.

## Source map

- WalletScope.Wpf/MainWindow.xaml — local Windows desktop UI.
- WalletScope.Wpf/MainWindow.xaml.cs — consent, mode switching, filtering and CSV export.
- WalletScope.Wpf/Services/LocalWalletInventory.cs — allowlisted read-only metadata discovery.
- WalletScope.Wpf/Services/DemoInventory.cs — fictional example data.
- WalletScope.Wpf/Models/WalletInstallation.cs — non-sensitive row model.
- ../tests/test_demo.js — static-browser UI data and CSV tests.

## Attributed learning references

- [Microsoft WPF Samples](https://github.com/microsoft/WPF-Samples)
- [Microsoft Windows Registry API](https://learn.microsoft.com/en-us/dotnet/api/microsoft.win32.registrykey)
- [GitHub Pages](https://docs.github.com/en/pages)

The source is original AI-assisted portfolio work. It is not copied from the reference repositories and has not been delivered to this employer.
