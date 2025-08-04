import { OverlayRef } from '@angular/cdk/overlay';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Options, Range } from '../model/model';
import { CalendarOverlayService } from '../services/calendar-overlay.service';
import { ConfigStoreService } from '../services/config-store.service';
import { RangeStoreService } from '../services/range-store.service';

@Component({
    selector: 'mat-pick-range',
    templateUrl: './mat-pick-range.component.html',
    providers: [CalendarOverlayService, RangeStoreService, ConfigStoreService, DatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class MatPickRangeComponent implements OnInit, OnDestroy {
  @ViewChild('calendarInput', { static: true }) calendarInput: ElementRef;
  @Output() readonly selectedDateRangeChanged: EventEmitter<Range> = new EventEmitter<Range>();
  @Input() options: Options;

  private rangeUpdate$: Subscription;
  public selectedDateRange = '';

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private calendarOverlayService: CalendarOverlayService,
    public rangeStoreService: RangeStoreService,
    public confStore: ConfigStoreService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.confStore.options = this.options;
    this.rangeUpdate$ = this.rangeStoreService.rangeUpdate$.subscribe((range) => {
      const from: string = this.formatToDateString(range.fromDate, this.confStore.options.format);
      const to: string = this.formatToDateString(range.toDate, this.confStore.options.format);
      this.selectedDateRange = `${from} - ${to}`;
      this.selectedDateRangeChanged.emit(range);
    });
    this.rangeStoreService.updateRange(this.confStore.options.range.fromDate, this.confStore.options.range.toDate);
    this.changeDetectionRef.detectChanges();
  }

  private formatToDateString(date: Date, format: string): string {
    return this.datePipe.transform(date, format);
  }

  openCalendar(event) {
    const overlayRef: OverlayRef = this.calendarOverlayService.open(this.confStore.options.calendarOverlayConfig, this.calendarInput);
  }

  public resetDates(range: Range) {
    this.rangeStoreService.updateRange(range.fromDate, range.toDate);
  }

  ngOnDestroy() {
    if (this.rangeUpdate$) {
      this.rangeUpdate$.unsubscribe();
    }
  }
}
