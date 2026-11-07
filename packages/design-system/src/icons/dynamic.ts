// lucide's DynamicIcon, which draws an icon by its kebab-case name, such as one a person chose in another app. Its name
// map and each icon are lazy chunks, so this has an entry of its own (`@lar-works/design-system/icons/dynamic`), which
// apps load with a dynamic import where they need it.
export { DynamicIcon, type IconName } from 'lucide-react/dynamic';
