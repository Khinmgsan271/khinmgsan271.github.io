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
    private readonly IReadOnlyList<WalletInstallation> _samples = DemoInventory.GetSampleRows();
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
    private void RefreshRows()
    {
        if (SearchBox is null || StatusPicker is null) return;
        string term = SearchBox.Text.Trim();
        string status = (StatusPicker.SelectedItem as ComboBoxItem)?.Content?.ToString() ?? "All statuses";
        var matches = _samples.Where(row =>
            (status == "All statuses" || row.Status == status) &&
            (row.WalletName.Contains(term, StringComparison.OrdinalIgnoreCase) ||
             row.AppType.Contains(term, StringComparison.OrdinalIgnoreCase) ||
             row.Browser.Contains(term, StringComparison.OrdinalIgnoreCase) ||
             row.BrowserProfile.Contains(term, StringComparison.OrdinalIgnoreCase)));
        VisibleRows.Clear();
        foreach (var row in matches) VisibleRows.Add(row);
        CountLabel.Text = $"Showing {VisibleRows.Count} of {_samples.Count} fictional sample records";
    }
    private static string CsvCell(string? value)
    {
        string cell = value ?? "";
        if (cell.TrimStart().StartsWith('=') || cell.TrimStart().StartsWith('+') ||
            cell.TrimStart().StartsWith('-') || cell.TrimStart().StartsWith('@'))
            cell = "'" + cell; // Mitigate formula injection when opened in spreadsheet software.
        return "\"" + cell.Replace("\"", "\"\"") + "\"";
    }
    private void OnExportClicked(object sender, RoutedEventArgs e)
    {
        var save = new SaveFileDialog
        {
            Title = "Save fictional WalletScope records",
            Filter = "CSV files (*.csv)|*.csv",
            FileName = "walletscope-synthetic-demo.csv",
            AddExtension = true,
            DefaultExt = ".csv"
        };
        if (save.ShowDialog(this) != true) return;
        var lines = new List<string> {
            "Wallet name,Application type,Browser,Example profile,Sample date,Fictional status"
        };
        foreach (var row in VisibleRows)
        {
            lines.Add(string.Join(",", new[] {
                CsvCell(row.WalletName), CsvCell(row.AppType), CsvCell(row.Browser),
                CsvCell(row.BrowserProfile), CsvCell(row.SampleDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture)),
                CsvCell(row.Status)
            }));
        }
        File.WriteAllLines(save.FileName, lines, new UTF8Encoding(true));
        MessageBox.Show(this, "Saved fictional example records only.", "WalletScope demo", MessageBoxButton.OK, MessageBoxImage.Information);
    }
}