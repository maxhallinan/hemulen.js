;(function(){
	var expect = chai.expect;

	var fooEl   = document.getElementById('foo');
	var fooForm = document.getElementById('fooform');
	var foo, fooElId;

	var requests        = [];
	var storedEvents    = [];
	var xhr;

	function handleEvent (e) {
		storedEvents.push(e);
	}

	describe('Hemulen form submission', function () {
		before(function(){
			xhr = sinon.useFakeXMLHttpRequest();
			xhr.onCreate = function (req) {
				requests.push(req);
			};

			foo = new Hemulen({
				hemulenEl: '.foo',
				namespace: 'foo'
			});

			fooElId = foo.getHemulenElId(fooEl);

			fooForm.addEventListener('hemulen-subsuccess', handleEvent);
			fooForm.addEventListener('hemulen-subfailure', handleEvent);

			for (var i = 0, j = 3; i < j; i++) {
				foo._subData(fooForm);
			}
		});

		after(function(){
			foo.destroy(fooElId);
		});

		it('makes a POST request', function () {
			expect(requests[0].method).to.equal('POST');
		});

		it('makes the request to the form\'s action attribute', function () {
			expect(requests[0].url).to.equal('/foo');
		});

		it('fires the hemulen-subsuccess event if the response is a 200 response', function () {
			requests[0].respond(200);
			requests[1].respond(202);

			expect(storedEvents[0].type).to.equal('hemulen-subsuccess');
			expect(storedEvents[1].type).to.equal('hemulen-subsuccess');
		});

		it('fires the hemulen-subfailure event if the response is not a 200-range response', function () {
			requests[2].respond(400);
			expect(storedEvents[2].type).to.equal('hemulen-subfailure');
		});

		it('the Hemulen submission event objects have a hemulenRequest property', function () {
			expect(storedEvents[0].hemulenRequest).to.exist;
			expect(storedEvents[2].hemulenRequest).to.exist;
		});

	});
}());
