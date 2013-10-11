<ul class="nav nav-pills pull-right">
{{#each items}}
	<li {{#if this.active}}class="active"{{/if}}><a href="#{{ this.link }}">{{ this.title }}</a></li>
{{/each}}
</ul>