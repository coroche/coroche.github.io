---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
#menus: header
---
{%- assign default_paths = site.pages | map: "path" -%}
{%- assign page_paths = site.header_pages | default: default_paths -%}

<dl>
{%- for path in page_paths -%}
{%- assign my_page = site.pages | where: "path", path | first -%}
{%- if my_page.title and my_page.includeonhomepage -%}
<dt>
<a class="page-link" href="{{ my_page.url | relative_url }}">{{ my_page.title | escape }}</a>
</dt>
<dd>{{ my_page.description }}</dd>
{%- endif -%}
{%- endfor -%}
</dl>

<style>
.page-link { color: #111 !important; line-height: 1.5;}
dt {font-size: 26px; font-weight: 300;}
dd {font-size: 13px; font-weight: 300; margin-left:10px; margin-bottom: 15px}
</style>

