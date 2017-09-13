import {
    Directive,
    EventEmitter,
    forwardRef,
    Inject,
    Input,
    OnDestroy,
    Output,
} from '@angular/core';
import { Control,
    ControlPosition,
    LeafletEvent } from 'leaflet';
import { ATTRIBUTION_PREFIX } from './consts';
import { MapComponent } from './map.component';

/**
 * Angular2 directive for the attribution-control of Leaflet.
 *
 * *You can use this directive in an Angular2 template after importing `YagaModule`.*
 *
 * How to use in a template:
 * ```html
 * <yaga-map>
 *     <yaga-attribution-control
 *         [(display)]="..."
 *         [(zIndex)]="..."
 *         [(position)]="..."
 *         [(prefix)]="..."
 *         [(attributions)]="..."
 *
 *         (add)="..."
 *         (remove)="..."
 *         (click)="..."
 *         (dbclick)="..."
 *         (mousedown)="..."
 *         (mouseover)="..."
 *         (mouseout)="..."
 *         >
 *     </yaga-attribution-control>
 * </yaga-map>
 * ```
 *
 * Notes:
 *
 * * All div-icon-directives have the css-class `yaga-div-icon`.
 * * The `contentHtml` property is not the child-node in the leaflet div-icon, it is the clone of it and gets cloned
 * again on every change.
 *
 * @link http://leafletjs.com/reference-1.0.3.html#control-attribution Original Leaflet documentation
 * @link https://leaflet-ng2.yagajs.org/latest/browser-test?grep=Attribution-Control%20Directive Unit-Test
 * @link https://leaflet-ng2.yagajs.org/latest/coverage/lcov-report/lib/attribution-control.directive.js.html
 * Test coverage
 * @link https://leaflet-ng2.yagajs.org/latest/typedoc/classes/attributioncontroldirective.html API documentation
 * @example https://leaflet-ng2.yagajs.org/latest/examples/attribution-control-directive/
 */
@Directive({
    selector: 'yaga-attribution-control',
})
export class AttributionControlDirective extends Control.Attribution implements OnDestroy  {
    /**
     * Two-Way bound property for the display status of the control.
     * Use it with `<yaga-attribution-control [(display)]="someValue">`
     * or `<yaga-attribution-control (displayChange)="processEvent($event)">`
     */
    @Output() public displayChange: EventEmitter<boolean> = new EventEmitter();
    /**
     * Two-Way bound property for the zIndex of the control.
     * Use it with `<yaga-attribution-control [(zIndex)]="someValue">`
     * or `<yaga-attribution-control (zIndexChange)="processEvent($event)">`
     */
    @Output() public zIndexChange: EventEmitter<number> = new EventEmitter();
    /**
     * Two-Way bound property for the position of the control.
     * Use it with `<yaga-attribution-control [(position)]="someValue">`
     * or `<yaga-attribution-control (positionChange)="processEvent($event)">`
     */
    @Output() public positionChange: EventEmitter<ControlPosition> = new EventEmitter();
    /**
     * Two-Way bound property for the prefix of the control.
     * Use it with `<yaga-attribution-control [(prefix)]="someValue">`
     * or `<yaga-attribution-control (prefixChange)="processEvent($event)">`
     */
    @Output() public prefixChange: EventEmitter<string> = new EventEmitter();
    /**
     * Two-Way bound property for the list of attributions of the control.
     * Use it with `<yaga-attribution-control [(attributions)]="someValue">`
     * or `<yaga-attribution-control (attributionsChange)="processEvent($event)">`
     */
    @Output() public attributionsChange: EventEmitter<string[]> = new EventEmitter();

    /**
     * From leaflet fired add event.
     * Use it with `<yaga-attribution-control (add)="processEvent($event)">`
     * @link http://leafletjs.com/reference-1.0.3.html#control-attribution-add Original Leaflet documentation
     */
    @Output('add') public addEvent: EventEmitter<LeafletEvent> = new EventEmitter();
    /**
     * From leaflet fired remove event.
     * Use it with `<yaga-attribution-control (remove)="processEvent($event)">`
     * @link http://leafletjs.com/reference-1.0.3.html#control-attribution-remove Original Leaflet documentation
     */
    @Output('remove') public removeEvent: EventEmitter<LeafletEvent> = new EventEmitter();
    /**
     * From leaflet fired click event.
     * Use it with `<yaga-attribution-control (click)="processEvent($event)">`
     * @link http://leafletjs.com/reference-1.0.3.html#control-attribution-click Original Leaflet documentation
     */
    @Output('click') public clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
    /**
     * From leaflet fired dbclick event.
     * Use it with `<yaga-attribution-control (dbclick)="processEvent($event)">`
     * @link http://leafletjs.com/reference-1.0.3.html#control-attribution-dbclick Original Leaflet documentation
     */
    @Output('dbclick') public dbclickEvent: EventEmitter<MouseEvent> = new EventEmitter();
    /**
     * From leaflet fired mousedown event.
     * Use it with `<yaga-attribution-control (mousedown)="processEvent($event)">`
     * @link http://leafletjs.com/reference-1.0.3.html#control-attribution-mousedown Original Leaflet documentation
     */
    @Output('mousedown') public mousedownEvent: EventEmitter<MouseEvent> = new EventEmitter();
    /**
     * From leaflet fired mouseover event.
     * Use it with `<yaga-attribution-control (mouseover)="processEvent($event)">`
     * @link http://leafletjs.com/reference-1.0.3.html#control-attribution-mouseover Original Leaflet documentation
     */
    @Output('mouseover') public mouseoverEvent: EventEmitter<MouseEvent> = new EventEmitter();
    /**
     * From leaflet fired mouseout event.
     * Use it with `<yaga-attribution-control (mouseout)="processEvent($event)">`
     * @link http://leafletjs.com/reference-1.0.3.html#control-attribution-mouseout Original Leaflet documentation
     */
    @Output('mouseout') public mouseoutEvent: EventEmitter<MouseEvent> = new EventEmitter();

    constructor(
        @Inject(forwardRef(() => MapComponent)) mapComponent: MapComponent,
    ) {
        super({prefix: ATTRIBUTION_PREFIX});
        mapComponent.addControl(this);

        const self: this = this;

        /* tslint:disable:only-arrow-functions */
        this.onRemove = function(): any {
            self.displayChange.emit(false);
            self.removeEvent.emit({target: self, type: 'remove'});
            return self;
        };

        this.onAdd = function(): HTMLElement {
            self.displayChange.emit(true);
            self.addEvent.emit({target: self, type: 'add'});
            return self.getContainer();
        };
        /* tslint:enable */

        // Events
        this.getContainer().addEventListener('click', (event: MouseEvent) => {
            this.clickEvent.emit(event);
        });
        this.getContainer().addEventListener('dbclick', (event: MouseEvent) => {
            this.dbclickEvent.emit(event);
        });
        this.getContainer().addEventListener('mousedown', (event: MouseEvent) => {
            this.mousedownEvent.emit(event);
        });
        this.getContainer().addEventListener('mouseover', (event: MouseEvent) => {
            this.mouseoverEvent.emit(event);
        });
        this.getContainer().addEventListener('mouseout', (event: MouseEvent) => {
            this.mouseoutEvent.emit(event);
        });
    }

    /**
     * Internal method to provide the removal of the control in Leaflet, when removing it from the Angular template
     */
    public ngOnDestroy(): void {
        ((this as any)._map as MapComponent).removeControl(this);
    }

    /**
     * Derived method of the original setPosition.
     * @link http://leafletjs.com/reference-1.0.3.html#control-attribution-setposition Original Leaflet documentation
     */
    public setPosition(val: ControlPosition): this {
      super.setPosition(val);
      this.positionChange.emit(val);
      return this;
    }

    /**
     * Two-Way bound property for the opacity.
     * Use it with `<yaga-attribution-control [(opacity)]="someValue">`
     * or `<yaga-attribution-control [opacity]="someValue">`
     * @link http://leafletjs.com/reference-1.0.3.html#control-attribution-opacity Original Leaflet documentation
     */
    @Input() public set opacity(val: number) {
        this.getContainer().style.opacity = val.toString();
    }
    public get opacity(): number {
        return parseFloat(this.getContainer().style.opacity);
    }

    /**
     * Two-Way bound property for the display state.
     * Use it with `<yaga-attribution-control [(display)]="someValue">`
     * or `<yaga-attribution-control [display]="someValue">`
     */
    @Input() public set display(val: boolean) {
        if (!(this as any)._map) {
            // No map available...
            return;
        }
        if (val) {
            this.getContainer().style.display = '';
            return;
        }
        this.getContainer().style.display = 'none';
        return;
    }
    public get display(): boolean {
        return (this as any)._map && this.getContainer().style.display !== 'none';
    }

    /**
     * Two-Way bound property for the position.
     * Use it with `<yaga-attribution-control [(position)]="someValue">`
     * or `<yaga-attribution-control [position]="someValue">`
     * @link http://leafletjs.com/reference-1.0.3.html#control-attribution-position Original Leaflet documentation
     */
    @Input() public set position(val: ControlPosition) {
      this.setPosition(val);
    }
    public get position(): ControlPosition {
      return this.getPosition();
    }

    /**
     * Derived method of the original setPrefix.
     * @link http://leafletjs.com/reference-1.0.3.html#control-attribution-setprefix Original Leaflet documentation
     */
    public setPrefix(prefix: string): this {
        super.setPrefix(prefix);
        this.prefixChange.emit(prefix);
        return this;
    }
    /**
     * Two-Way bound property for the prefix.
     * Use it with `<yaga-attribution-control [(prefix)]="someValue">`
     * or `<yaga-attribution-control [prefix]="someValue">`
     * @link http://leafletjs.com/reference-1.0.3.html#control-attribution-prefix Original Leaflet documentation
     */
    @Input() public set prefix(val: string) {
        this.setPrefix(val);
    }
    public get prefix(): string {
        return (this.options.prefix as string);
    }

    /**
     * Derived method of the original addAttribution.
     * @link http://leafletjs.com/reference-1.0.3.html#control-attribution-addattribution Original Leaflet documentation
     */
    public addAttribution(val: string): this {
        super.addAttribution(val);
        this.attributionsChange.emit(this.attributions);
        return this;
    }
    /**
     * Derived method of the original removeAttribution.
     * @link http://leafletjs.com/reference-1.0.3.html#control-attribution-removeattribution
     * Original Leaflet documentation
     */
    public removeAttribution(val: string): this {
        super.removeAttribution(val);
        this.attributionsChange.emit(this.attributions);
        return this;
    }
    /**
     * Two-Way bound property for the attributions.
     * Use it with `<yaga-attribution-control [(attributions)]="someValue">`
     * or `<yaga-attribution-control [attributions]="someValue">`
     * @link http://leafletjs.com/reference-1.0.3.html#control-attribution-attributions Original Leaflet documentation
     */
    @Input() public set attributions(val: string[]) {
        this.removeAllAttributions(true);
        for (const attr of val) {
            super.addAttribution(attr);
        }
        this.attributionsChange.emit(this.attributions);
    }
    public get attributions(): string[] {
        const keys: string[] = Object.keys((this as any)._attributions);
        const arr: string[] = [];
        for (const key of keys) {
            if ((this as any)._attributions[key] === 1) {
                arr.push(key);
            }
        }
        return arr;
    }

    /**
     * Self written method to provide the removal of all attributions in a single step
     */
    public removeAllAttributions(silent?: boolean): this {
        const keys: string[] = Object.keys((this as any)._attributions);
        for (const key of keys) {
            super.removeAttribution(key);
        }
        if (silent) {
            return this;
        }
        this.attributionsChange.emit([]);
        return this;
    }
}
