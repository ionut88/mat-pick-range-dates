import { Component, OnInit, ViewChild } from '@angular/core';
import { Options, Range } from 'projects/mat-pick-range-dates/src/public-api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false
})
export class AppComponent implements OnInit {
  public range1: Range = { fromDate: new Date(), toDate: new Date() };
  public range2: Range = { fromDate: new Date(), toDate: new Date() };
  options: Options;
  @ViewChild('picker1', { static: false }) picker1;
  @ViewChild('picker2', { static: false }) picker2;

  ngOnInit() {
    const addDays = (numOfDays) => {
      const today = new Date();
      return new Date(today.setDate(today.getDate() + numOfDays));
    };
    const today = new Date();
    this.options = {
      presets: [
        {
          presetLabel: 'Last 7 Days',
          range: { fromDate: addDays(-7), toDate: today },
        },
        {
          presetLabel: 'Last 30 Days',
          range: { fromDate: addDays(-30), toDate: today },
        },
        {
          presetLabel: 'Last 45 Days',
          range: { fromDate: addDays(-45), toDate: today },
        },
      ],
      format: 'mediumDate',
      range: { fromDate: addDays(-1), toDate: today },
      excludeWeekends: true,
      locale: 'en-US',
      fromMinMax: { fromDate: addDays(-45), toDate: addDays(5) },
      toMinMax: { fromDate: addDays(-45), toDate: addDays(5) },
      applyLabel: 'Apply',
      cancelLabel: 'Cancel',
      calendarOverlayConfig: {
        panelClass: 'mat-prd-overlay',
        hasBackdrop: true,
        backdropClass: 'mat-prd-overlay-backdrop',
        shouldCloseOnBackdropClick: true,
      },
      placeholder: 'Choose a date',
      startDatePrefix: 'FROM:',
      endDatePrefix: 'TO:',
    };
  }

  updateRange1(range: Range) {
    this.range1 = range;
  }

  updateRange2(range: Range) {
    this.range2 = range;
  }

  reset() {
    const today = new Date();
    this.picker1.resetDates({ fromDate: today, toDate: today });
    this.picker2.resetDates({
      fromDate: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 1
      ),
      toDate: today,
    });
  }
}
