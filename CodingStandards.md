# Code Style Rules

- Vue files must follow the template format of template at the top, script in the middle, style below
- style blocks should be scoped wherever possible
- Any teleport blocks must be in a <client-only> page
- Components must be invoked using kebab-case, i.e. layout-dock-item, not camelcase i.e. LayoutDockItem
- Componets structure must be as follows: 

```
<[component name] [logical check (i.e. v-if)] [element params (i.e. class, id)] 
    [component params]>
    [content data]
</[component name]>
```
For example:
```
<panel v-if="true" class="mypanel"
    :title="Panel Title"
    :title-size="medium">
    <div>This is the panel contents</div>
</panel>
```