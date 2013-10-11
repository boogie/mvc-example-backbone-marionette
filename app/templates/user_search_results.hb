{{#if results }}
Fake results:
<table class="table table-border table-striped">
	<thead>
		<tr>
			<th>#</th>
			<th>query character</th>
			<th>character code</th>
		</tr>
	</thead>
	<tbody>
	{{#each results }}
		<tr>
			<td>{{ this.num }}</td>
			<td>{{ this.char }}</td>
			<td>{{ this.code }}</td>
		</tr>
	{{/each }}
	</tbody>
</table>
{{/if }}
