import { OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PresetItem } from '../model/model';
import { ConfigStoreService } from '../services/config-store.service';
import { RangeStoreService } from '../services/range-store.service';

@Component({
    selector: 'picker-overlay',
    templateUrl: './picker-overlay.component.html',
    styleUrls: ['./picker-overlay.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class PickerOverlayComponent implements OnInit {
  fromDate: Date;
  toDate: Date;
  fromMinDate: Date;
  fromMaxDate: Date;
  toMinDate: Date;
  toMaxDate: Date;

  constructor(private rangeStoreService: RangeStoreService, public configService: ConfigStoreService, private overlayRef: OverlayRef) {}

  ngOnInit() {
    this.fromDate = this.rangeStoreService.fromDate;
    if (this.fromDate) {
      this.toMinDate = this.fromDate;
    }
    this.toDate = this.rangeStoreService.toDate;
    if (this.toDate) {
      this.toMinDate = this.toDate;
    }
    ({ fromDate: this.fromMinDate, toDate: this.fromMaxDate } = this.configService.options.fromMinMax);
    ({ fromDate: this.toMinDate, toDate: this.toMaxDate } = this.configService.options.toMinMax);
  }

  updateFromDate(date: Date) {
    this.fromDate = date;
    this.toMinDate = date;
  }

  updateToDate(date: Date) {
    this.toDate = date;
    this.fromMaxDate = date;
  }

  updateRangeByPreset(presetItem: PresetItem) {
    this.updateFromDate(presetItem.range.fromDate);
    this.updateToDate(presetItem.range.toDate);
  }

  applyNewDates(e) {
    this.rangeStoreService.updateRange(this.fromDate, this.toDate);
    this.disposeOverLay();
  }

  discardNewDates(e) {
    this.disposeOverLay();
  }

  private disposeOverLay() {
    this.overlayRef.dispose();
  }
}
