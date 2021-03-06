import {Binding, Color, Cursor, Stream, Vector2} from 'vega';
import {isObject} from 'vega-util';
import {SingleDefUnitChannel} from './channel';
import {FieldName, PrimitiveValue} from './channeldef';
import {DateTime} from './datetime';
import {ParameterName} from './parameter';
import {Dict} from './util';

export const SELECTION_ID = '_vgsid_';
export type SelectionType = 'point' | 'interval';
export type SelectionResolution = 'global' | 'union' | 'intersect';

export type SelectionInit = PrimitiveValue | DateTime;
export type SelectionInitInterval = Vector2<boolean> | Vector2<number> | Vector2<string> | Vector2<DateTime>;

export type SelectionInitMapping = Dict<SelectionInit>;
export type SelectionInitIntervalMapping = Dict<SelectionInitInterval>;

export type LegendStreamBinding = {legend: string | Stream};
export type LegendBinding = 'legend' | LegendStreamBinding;

export interface BaseSelectionConfig<T extends SelectionType = SelectionType> {
  /**
   * Determines the default event processing and data query for the selection. Vega-Lite currently supports two selection types:
   *
   * - `"point"` -- to select multiple discrete data values; the first value is selected on `click` and additional values toggled on shift-click.
   * - `"interval"` -- to select a continuous range of data values on `drag`.
   */
  type: T;

  /**
   * Clears the selection, emptying it of all values. Can be a
   * [Event Stream](https://vega.github.io/vega/docs/event-streams/) or `false` to disable.
   *
   * __Default value:__ `dblclick`.
   *
   * __See also:__ [`clear`](https://vega.github.io/vega-lite/docs/clear.html) documentation.
   */
  clear?: Stream | string | boolean;

  /**
   * A [Vega event stream](https://vega.github.io/vega/docs/event-streams/) (object or selector) that triggers the selection.
   * For interval selections, the event stream must specify a [start and end](https://vega.github.io/vega/docs/event-streams/#between-filters).
   */
  on?: Stream | string;
  /**
   * With layered and multi-view displays, a strategy that determines how
   * selections' data queries are resolved when applied in a filter transform,
   * conditional encoding rule, or scale domain.
   *
   * __See also:__ [`resolve`](https://vega.github.io/vega-lite/docs/selection-resolve.html) documentation.
   */
  resolve?: SelectionResolution;

  // TODO(https://github.com/vega/vega-lite/issues/2596).
  // predicate?: string;
  // domain?: SelectionDomain;

  /**
   * An array of encoding channels. The corresponding data field values
   * must match for a data tuple to fall within the selection.
   *
   * __See also:__ [`encodings`](https://vega.github.io/vega-lite/docs/project.html) documentation.
   */
  encodings?: SingleDefUnitChannel[];

  /**
   * An array of field names whose values must match for a data tuple to
   * fall within the selection.
   *
   * __See also:__ [`fields`](https://vega.github.io/vega-lite/docs/project.html) documentation.
   */
  fields?: FieldName[];
}

export interface PointSelectionConfig extends BaseSelectionConfig<'point'> {
  /**
   * Controls whether data values should be toggled or only ever inserted into
   * multi selections. Can be `true`, `false` (for insertion only), or a
   * [Vega expression](https://vega.github.io/vega/docs/expressions/).
   *
   * __Default value:__ `true`, which corresponds to `event.shiftKey` (i.e.,
   * data values are toggled when a user interacts with the shift-key pressed).
   *
   * Setting the value to the Vega expression `"true"` will toggle data values
   * without the user pressing the shift-key.
   *
   * __See also:__ [`toggle`](https://vega.github.io/vega-lite/docs/toggle.html) documentation.
   */
  toggle?: string | boolean;

  /**
   * When true, an invisible voronoi diagram is computed to accelerate discrete
   * selection. The data value _nearest_ the mouse cursor is added to the selection.
   *
   * __See also:__ [`nearest`](https://vega.github.io/vega-lite/docs/nearest.html) documentation.
   */
  nearest?: boolean;
}

// Similar to BaseMarkConfig but the field documentations are specificly for an interval mark.
export interface BrushConfig {
  /**
   * The fill color of the interval mark.
   *
   * __Default value:__ `"#333333"`
   *
   */
  fill?: Color;
  /**
   * The fill opacity of the interval mark (a value between `0` and `1`).
   *
   * __Default value:__ `0.125`
   */
  fillOpacity?: number;
  /**
   * The stroke color of the interval mark.
   *
   * __Default value:__ `"#ffffff"`
   */
  stroke?: Color;
  /**
   * The stroke opacity of the interval mark (a value between `0` and `1`).
   */
  strokeOpacity?: number;
  /**
   * The stroke width of the interval mark.
   */
  strokeWidth?: number;
  /**
   * An array of alternating stroke and space lengths, for creating dashed or dotted lines.
   */
  strokeDash?: number[];
  /**
   * The offset (in pixels) with which to begin drawing the stroke dash array.
   */
  strokeDashOffset?: number;
  /**
   * The mouse cursor used over the interval mark. Any valid [CSS cursor type](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor#Values) can be used.
   */
  cursor?: Cursor;
}

export interface IntervalSelectionConfig extends BaseSelectionConfig<'interval'> {
  /**
   * When truthy, allows a user to interactively move an interval selection
   * back-and-forth. Can be `true`, `false` (to disable panning), or a
   * [Vega event stream definition](https://vega.github.io/vega/docs/event-streams/)
   * which must include a start and end event to trigger continuous panning.
   *
   * __Default value:__ `true`, which corresponds to
   * `[mousedown, window:mouseup] > window:mousemove!` which corresponds to
   * clicks and dragging within an interval selection to reposition it.
   *
   * __See also:__ [`translate`](https://vega.github.io/vega-lite/docs/translate.html) documentation.
   */
  translate?: string | boolean;

  /**
   * When truthy, allows a user to interactively resize an interval selection.
   * Can be `true`, `false` (to disable zooming), or a [Vega event stream
   * definition](https://vega.github.io/vega/docs/event-streams/). Currently,
   * only `wheel` events are supported.
   *
   * __Default value:__ `true`, which corresponds to `wheel!`.
   *
   * __See also:__ [`zoom`](https://vega.github.io/vega-lite/docs/zoom.html) documentation.
   */
  zoom?: string | boolean;

  /**
   * An interval selection also adds a rectangle mark to depict the
   * extents of the interval. The `mark` property can be used to customize the
   * appearance of the mark.
   *
   * __See also:__ [`mark`](https://vega.github.io/vega-lite/docs/selection-mark.html) documentation.
   */
  mark?: BrushConfig;
}

export interface SelectionParameter<T extends SelectionType = SelectionType> {
  /**
   * Required. A unique name for the selection parameter. Selection names should be valid JavaScript identifiers: they should contain only alphanumeric characters (or "$", or "_") and may not start with a digit. Reserved keywords that may not be used as parameter names are "datum", "event", "item", and "parent".
   */
  name: ParameterName;

  /**
   * Determines the default event processing and data query for the selection. Vega-Lite currently supports two selection types:
   *
   * - `"point"` -- to select multiple discrete data values; the first value is selected on `click` and additional values toggled on shift-click.
   * - `"interval"` -- to select a continuous range of data values on `drag`.
   */
  select: T | (T extends 'point' ? PointSelectionConfig : T extends 'interval' ? IntervalSelectionConfig : never);

  /**
   * Initialize the selection with a mapping between [projected channels or field names](https://vega.github.io/vega-lite/docs/project.html) and initial values.
   *
   * __See also:__ [`init`](https://vega.github.io/vega-lite/docs/init.html) documentation.
   */
  value?: T extends 'point'
    ? SelectionInit | SelectionInitMapping[]
    : T extends 'interval'
    ? SelectionInitIntervalMapping
    : never;

  /**
   * When set, a selection is populated by input elements (also known as dynamic query widgets)
   * or by interacting with the corresponding legend. Direct manipulation interaction is disabled by default;
   * to re-enable it, set the selection's [`on`](https://vega.github.io/vega-lite/docs/selection.html#common-selection-properties) property.
   *
   * Legend bindings are restricted to selections that only specify a single field or encoding.
   *
   * Query widget binding takes the form of Vega's [input element binding definition](https://vega.github.io/vega/docs/signals/#bind)
   * or can be a mapping between projected field/encodings and binding definitions.
   *
   * __See also:__ [`bind`](https://vega.github.io/vega-lite/docs/bind.html) documentation.
   */
  bind?: T extends 'point'
    ? Binding | Record<string, Binding> | LegendBinding
    : T extends 'interval'
    ? 'scales'
    : never;
}

export type TopLevelSelectionParameter = SelectionParameter & {
  /**
   * By default, top-level selections are applied to every view in the visualization.
   * If this property is specified, selections will only be applied to views with the given names.
   */
  views?: (string | string[])[];
};

export type ParameterExtent =
  | {
      /**
       * The name of a parameter.
       */
      param: ParameterName;
      /**
       * If a selection parameter is specified, the field name to extract selected values for
       * when the selection is [projected](https://vega.github.io/vega-lite/docs/project.html) over multiple fields or encodings.
       */
      field?: FieldName;
    }
  | {
      /**
       * The name of a parameter.
       */
      param: ParameterName;
      /**
       * If a selection parameter is specified, the encoding channel to extract selected values for
       * when a selection is [projected](https://vega.github.io/vega-lite/docs/project.html) over multiple fields or encodings.
       */
      encoding?: SingleDefUnitChannel;
    };

export interface SelectionConfig {
  /**
   * The default definition for a [`point`](https://vega.github.io/vega-lite/docs/parameter.html#select) selection. All properties and transformations
   *  for a point selection definition (except `type`) may be specified here.
   *
   * For instance, setting `point` to `{"on": "dblclick"}` populates point selections on double-click by default.
   */
  point?: Omit<PointSelectionConfig, 'type'>;
  /**
   * The default definition for an [`interval`](https://vega.github.io/vega-lite/docs/parameter.html#select) selection. All properties and transformations
   * for an interval selection definition (except `type`) may be specified here.
   *
   * For instance, setting `interval` to `{"translate": false}` disables the ability to move
   * interval selections by default.
   */
  interval?: Omit<IntervalSelectionConfig, 'type'>;
}

export const defaultConfig: SelectionConfig = {
  point: {
    on: 'click',
    fields: [SELECTION_ID],
    toggle: 'event.shiftKey',
    resolve: 'global',
    clear: 'dblclick'
  },
  interval: {
    on: '[mousedown, window:mouseup] > window:mousemove!',
    encodings: ['x', 'y'],
    translate: '[mousedown, window:mouseup] > window:mousemove!',
    zoom: 'wheel!',
    mark: {fill: '#333', fillOpacity: 0.125, stroke: 'white'},
    resolve: 'global',
    clear: 'dblclick'
  }
};

export function isLegendBinding(bind: any): bind is LegendBinding {
  return !!bind && (bind === 'legend' || !!bind.legend);
}

export function isLegendStreamBinding(bind: any): bind is LegendStreamBinding {
  return isLegendBinding(bind) && isObject(bind);
}

export function isSelectionParameter(param: any): param is SelectionParameter {
  return !!param['select'];
}
