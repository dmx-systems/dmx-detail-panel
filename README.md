# DeepaMehta 5 Detail Panel

## Version History

**0.16** -- Oct 21, 2018

* Rename component prop `object-renderers` to `detail-renderers`. It contains both, `object` and `value` renderers.

**0.15** -- Oct 6, 2018

* Info-tab component does not render title. The underlying object renderer has full rendering control.
* New component property `markerIds` allows rendering certain topics as "marked" in the related-tab
* Component supports manual mounting in conjunction with manual data update ("props" are mirrored as "data")

**0.14** -- Jul 31, 2018

* Add GitLab CI/CD

**0.13** -- Apr 10, 2018

* Custom style for Element UI tabs

**0.12** -- Mar 25, 2018

* Improved auto-positioning of new topics
* Improved composability:
    * New `quill-config` property allows parent component to customize the Quill editor in both ways, setting options, and providing extensions (e.g. formats)
    * Emit `submit-inline` event to signalize "inline editing completed" (info-tab)
    * Emit `child-topic-reveal` to signalize "user clicked 'Reveal' button" (info-tab)
    * Emit `related-topic-click` to signalize "user clicked related topic" (related-tab)
* Packaging: `dm5-topic-list` is now a reusable component, a standalone node-module

**0.11** -- Feb 21, 2018

* Improved composability:
    * Component relies on explicit props (instead of context injection).
    * Props have reasonable defaults.
    * Emit events (instead of dispatching into the host app): `tab-click`, `edit`, `submit`.
    * Panel visibility and tab selection can be controlled from outside.
* Internal edit buffer.

**0.10** -- Feb 3, 2018

* Access Control
* Composability: access injected context instead of host app's store

**0.9** -- Jan 13, 2018

* "Info" tab:
    * Multi-value fields
* "Related" tab:
    * Topic list is sorted and grouped
    * Show topic icons
    * Show assocs

**0.8** -- Dec 5, 2017

* Editor for "relating associations"
* Inline editing
* Reveal child topics from info display (1st tab)
* Configure Select widget to allow custom values
* Adapt to Element UI 2.0

**0.7** -- Nov 19, 2017

* Dynamic widget mechanism for simple fields

**0.6** -- Oct 19, 2017

* Injectable custom renderers
* Association editor
* Type editor

**0.5** -- Oct 3, 2017

* Render Boolean field as checkbox

**0.4** -- Sep 7, 2017

* In-app topic links in HTML fields

**0.3** -- Jun 30, 2017

**0.2** -- Jun 14, 2017

**0.1** -- Apr 28, 2017

------------
Jörg Richter  
Oct 21, 2018
