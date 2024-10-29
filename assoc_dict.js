var _assoclastword = false;

jQuery( document ).ready(

	function() {
		assocGetWord( assoc.startword );
	}

);

function assocGetWord( _word ) {

	jQuery.getJSON(
		assoc.ajaxurl,
		{ 'word': _word, 'action': 'get_word' },
		function(_result) {
			_logStatus(_result);
			assocShowWord(_result);
		}
	);

}

function assocAddWord( _word, _description ) {

	jQuery.getJSON(
		assoc.ajaxurl,
		{ 'addword': _word, 'adddescr': _description, 'action': 'add_word', 'nonce': assoc.nonce },
		function(_result) {

			console.log(_result);
			if (200 == _result.status) {
				assocShowWord( _result );
			} else {
				// todo: create nice way of telling user about error
				alert('Could not add word to dictionary');
			}
		}
	);
}

function assocShowWord( _serverdata ) {

	_logStatus( _serverdata );

	_html ='';

	_word		= _serverdata.word;

	switch ( _serverdata.status ) {

		case 200:

			// remember last word that has been shown
			_assoclastword	= _serverdata;

			_id				= _serverdata.id;

			// add link on every word
			var _desc = _serverdata.desc.replace(
							/\w+/g,
							function(_match) {
								return (_match.length > 1) ? '<a href="#" class="assoclink">' + _match + '</a>' : _match;
							}
						);
			
			_html += '<h2>' + _word + '</h2>';
			_html += '<p>' + _desc + '</p>';

			jQuery("#assoc_dict_word").html( _html );

			jQuery('.assoclink').on( 'click', function( _e ) {

				_e.preventDefault();
				assocGetWord( jQuery(this).text() );

			});

			break;

		case 404:

			// show form to add a description
			_html += '<h2>' + _word + '</h2>';
			_html += '<p>' + assoc.txt.word_not_in_dict + '</p>';
			_html += '<form id="assocaddword">';
			_html += '<input type="hidden" id="assocnewword" name="assocnewword" value="' + _word + '">';
			_html += '<textarea id="assocnewdesc" name="assocnewdesc"></textarea>';
			_html += '<input type="submit" value="' + assoc.txt.button_add + '" />';
			_html += '<input type="button" id="assoccancel" value="' + assoc.txt.button_cancel + '" />';
			_html += '</form>';

			jQuery("#assoc_dict_word").html( _html );

			// on submit, send new description to server
			jQuery('#assocaddword').on( "submit", function( _e ) {

				_e.preventDefault();

				// that is, when something has been written
				if ('' != jQuery('#assocaddword #assocnewdesc').val().trim() ) {
					assocAddWord( jQuery('#assocaddword #assocnewword').val(), jQuery('#assocaddword #assocnewdesc').val() );
				}

			} );

			// on cancel, show last word that has been shown
			jQuery('#assoccancel').on( "click", function( _e ) {

				_e.preventDefault();
				
				if (false !== assocShowWord) {
					assocShowWord(_assoclastword);
				}

			} );

			break;
		default:
			break;
	}

}

var _logStatus = function(text) {
	if ('undefined' != typeof console)
		if ('function' == typeof console.log)
			console.log(text);
};