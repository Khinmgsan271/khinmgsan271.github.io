using System.Collections.ObjectModel;
using System.Globalization;
using System.IO;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using Microsoft.Win32;
using WalletScope.Models;
using WalletScope.Services;

namespace WalletScope;

public partial class MainWindow : Window
{
    private IReadOnlyList<WalletInstallation> _rows = DemoInventory.GetSampleRows();
    private bool _showingLiveInventory;
    public ObservableCollection<WalletInstallation> VisibleRows { get; } = [];

    public MainWindow()
    {
        InitializeComponent();
        DataContext = this;
        RefreshRows();
    }

    private void OnSearchChanged(object sender, TextChangedEventArgs e)
    {
        if (IsLoaded) RefreshRows();
    }

    private void OnStatusChanged(object sender, SelectionChangedEventArgs e)
    {
        if (IsLoaded) RefreshRows();
    }

    private void OnScanClicked(object sender, RoutedEventArgs e)
    {
        var message = "Scan this Windows PC for the presence of known wallet software?\n\n" +
            "Only the existence and creation timestamp of known browser extension folders " +
            "and Windows installed-program display names/dates will be checked. " +
            "Wallet contents, keys, phrases, balances, browsing history and addresses will never be opened.\n\n" +
            "Nothing is uploaded or stored. Only run this on a computer you own or administer.";
        if (MessageBox.Show(this, message, "Consent to local-only inventory",
                MessageBoxButton.YesNo, MessageBoxImage.Question) != MessageBoxResult.Yes)
            return;

        try
        {
            // The first real inventory action is here; no scanning takes place at startup.
            _rows = LocalWalletInventory.Scan();
            _showingLiveInventory = true;
            ModeLabel.Text = "MODE: USER-INITIATED LOCAL INVENTORY";
            ModeLabel.Foreground = System.Windows.Media.Brushes.LightSalmon;
            RefreshRows();
        }
        catch (Exception ex) when (ex is UnauthorizedAccessException or IOException or System.Security.SecurityException)
        {
            MessageBox.Show(this, "Local inventory could not be completed because some " +
                "installation metadata was unavailable. No wallet contents were accessed.",
                "Local inventory unavailable", MessageBoxButton.OK, MessageBoxImage.Information);
        }
    }

    private void OnDemoClicked(object sender, RoutedEventArgs e)
    {
        _rows = DemoInventory.GetSampleRows();
        _showingLiveInventory = false;
        ModeLabel.Text = "MODE: FICTIONAL DEMO";
        ModeLabel.Foreground = System.Windows.Media.Brushes.LightGreen;
        RefreshRows();
    }

    private void RefreshRows()
    {
        if (SearchBox is null || StatusPicker is null || CountLabel is null) return;
        string term = SearchBox.Text.Trim();
        string status = (StatusPicker.SelectedItem as ComboBoxItem)?.Content?.ToString() ?? "All statuses";
        var matches = _rows.Where(row =>
            (status == "All statuses" || row.Status == status) &&
            (row.WalletName.Contains(term, StringComparison.OrdinalIgnoreCase) ||
             row.AppType.Contains(term, StringComparison.OrdinalIgnoreCase) ||
             row.Browser.Contains(term, StringComparison.OrdinalIgnoreCase) ||
             row.BrowserProfile.Contains(term, StringComparison.OrdinalIgnoreCase)));
        VisibleRows.Clear();
        foreach (var row in matches) VisibleRows.Add(row);
        CountLabel.Text = $"Showing {VisibleRows.Count} of {_rows.Count} " +
            (_showingLiveInventory ? "local metadata entries; not saved" : "fictional sample records");
    }

    private static string CsvCell(string? value)
    {
        string cell = value ?? "";
        if (cell.TrimStart().StartsWith('=') || cell.TrimStart().StartsWith('+') ||
            cell.TrimStart().StartsWith('-') || cell.TrimStart().StartsWith('@'))
            cell = "'" + cell;
        return "\"" + cell.Replace("\"", "\"\"") + "\"";
    }

    private void OnExportClicked(object sender, RoutedEventArgs e)
    {
        var save = new SaveFileDialog {
            Title = _showingLiveInventory ? "Export your local metadata (optional)" : "Save fictional WalletScope samples",
            Filter = "CSV files (*.csv)|*.csv",
            FileName = _showingLiveInventory ? "walletscope-local-inventory.csv" : "walletscope-synthetic-demo.csv",
            AddExtension = true,
            DefaultExt = ".csv"
        };
        if (save.ShowDialog(this) != true) return;
        var lines = new List<string> {
            "Wallet name,Application type,Browser,Browser profile label,Approximate install metadata,Status"
        };
        foreach (var row in VisibleRows)
        {
            lines.Add(string.Join(",", new[] {
                CsvCell(row.WalletName), CsvCell(row.AppType), CsvCell(row.Browser),
                CsvCell(row.BrowserProfile),
                CsvCell(row.SampleDate?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? "Unknown"),
                CsvCell(row.Status)
            }));
        }
        File.WriteAllLines(save.FileName, lines, new UTF8Encoding(true));
        MessageBox.Show(this, "Saved the currently displayed rows locally. Nothing was uploaded.",
            "WalletScope export", MessageBoxButton.OK, MessageBoxImage.Information);
    }
}
