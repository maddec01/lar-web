---
'@lar-works/design-system': patch
---

`DesignSystemProvider` now shares one tooltip provider, so components that show a tooltip (such as `ImagePicker`'s
full candidate titles) work in every app without the app mounting `TooltipProvider` itself.
