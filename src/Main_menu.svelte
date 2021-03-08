
<script>
	let value = 'world'
	let submit = false

	console.log( "testing" );

	const handleSubmit = () => {
		submit = true
		console.log( submit );
	}

	const handleKeyup = () => {
		submit = false

		if (event.code == 'Enter') {
			event.preventDefault()
			event.target.value
			value = event.target.value
			return false
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<input type="text" on:keyup|preventDefault={handleKeyup}>
	<button type="submit">
		Submit
	</button>
</form>

{submit}
<h1>Hello {value}!</h1>
