import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ElementRef, Injectable, Injector } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { CalendarOverlayConfig } from '../model/model';
import { PickerOverlayComponent } from '../picker-overlay/picker-overlay.component';

const DEFAULT_CONFIG: CalendarOverlayConfig = {
  panelClass: 'mat-prd-overlay',
  hasBackdrop: true,
  backdropClass: 'mat-prd-overlay-backdrop',
  shouldCloseOnBackdropClick: true,
};

@Injectable()
export class CalendarOverlayService {
  private hostElemRef: ElementRef;

  constructor(private readonly overlay: Overlay, private readonly injector: Injector) {}

  open(config: CalendarOverlayConfig = {}, hostElemRef: ElementRef): OverlayRef {
    this.hostElemRef = hostElemRef;
    const overlayConfig = { ...DEFAULT_CONFIG, ...config };
    const overlayRef = this.createOverlay(overlayConfig);
    const portalInjector = this.createInjector(overlayRef);
    const calendarPortal = new ComponentPortal(PickerOverlayComponent, null, portalInjector);
    overlayRef.attach(calendarPortal);
    overlayRef
      .backdropClick()
      .pipe(takeWhile(() => overlayConfig?.shouldCloseOnBackdropClick))
      .subscribe(() => overlayRef.dispose());
    return overlayRef;
  }

  private createOverlay(config: CalendarOverlayConfig): OverlayRef {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private getOverlayConfig(config: CalendarOverlayConfig): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.hostElemRef)
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withDefaultOffsetY(12)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
        },
      ]);
    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
    });
    return overlayConfig;
  }

  private createInjector(overlayRef: OverlayRef): Injector {
    const options = { providers: [{ provide: OverlayRef, useValue: overlayRef }], parent: this.injector };
    return Injector.create(options);
  }
}
