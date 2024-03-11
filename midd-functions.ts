function areSetsEqual<T>(setA: Set<T>, setB: Set<T>): string | string[] {
    const unequal : string[] = [];
    // Check every element in setA to see if it exists in setB
    for (let a of setA) {
      if (!setB.has(a)) {
        unequal.push(a as string); // If an element in setA is not in setB, sets are not equal
      }
    }

    if (unequal.length === 0) return 'YES';
    return unequal;
}

function setDataValidation(range: GoogleAppsScript.Spreadsheet.Range, options: string[]) {
    const rules = SpreadsheetApp.newDataValidation()
        .requireValueInList(options, true) // Define the options for the dropdown
        .setAllowInvalid(false) // Disallow input that doesn't match the dropdown options
        .build();
    range.clearDataValidations();
    range.setDataValidation(rules);
}

class Range {
    private deRange: GoogleAppsScript.Spreadsheet.Range;
    private daSheet: GoogleAppsScript.Spreadsheet.Sheet;
    private headers: Array<string>;
    private columns: Array<string>;
    private headRow: number;

    constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet, params: {columns: Array<string>, rows?: number}) {
        this.daSheet = sheet;
        let startRow = 0, startCol = -1, finalCol = -1, daHeader = [];
        while (startCol < 0 || finalCol < 0) {
            startRow++;
            daHeader = sheet.getRange(startRow + ':' + startRow).getValues().flat();
            startCol = daHeader.findIndex(col => (col as string).startsWith(params.columns[0]));
            finalCol = daHeader.findIndex(col => (col as string).startsWith(params.columns.at(-1)!));
        }
        this.headers = daHeader;
        this.headRow = startRow;
        this.columns = this.headers.slice(startCol, finalCol + 1);
        this.deRange = sheet.getRange(startRow + 1, startCol + 1, params.rows ?? sheet.getLastRow(), finalCol - startCol + 1);
    }

    public range = () => this.deRange;
    public column = (column: string) : Array<string> => {
        const col = this.columns.findIndex(col => col.startsWith(column));
        if (col < 0) return [];
        return this.daSheet.getRange(this.headRow + 1, col + 1, this.daSheet.getLastRow(), 1).getValues().flat();
    }
}