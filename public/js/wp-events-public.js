jQuery(document).ready(function ($) {
	'use strict';

	/**
	 * display error if form is submitted without checking recaptcha
	 * 
	 * @since 1.2.0
	 * @returns bool
	 */
	 function wpeValidRecaptcha() {
		var response = grecaptcha.getResponse();
		if (response.length === 0) {
			$('.recaptcha-error').text('The captcha is required.').css('color', 'red');
			$('.recaptcha-error').css('display', 'block');
			$('.recaptcha-error').css('visibility', 'visible');
			return false;
		} else {
			$('.recaptcha-error').css('display', 'none');
			return true;
		}
	}

	/**
	 * ajax request for reCAPTCHA validation
	 * 
	 * @param {object} form 
	 * @param {string} data 
	 * @param {string} action2
	 * 
	 * @since 1.2.0 
	 */
	function wpeVerifyCaptcha( form ) {
		var serializedValues = form.serialize();
		jQuery.ajax({ 
			type: 'POST',
			url: wpe_ajaxobject.ajaxurl,
			data: { serializedValues,
					action: 'wpe_verify_captcha',
					captchaResponse: grecaptcha.getResponse() },
			success: function( response ) {
				if( response === 'success' ) {
					submitForm( form );
				} else {
					wpe_popup('Please verify captcha and submit again.');
				}
			},
			error: function( error ) {
				wpe_popup('Could not verify reCAPTCHA.');
			}
		});
	}

	/**
	 * Registration Form Validation
	 * */
	//variables
	var siteKey   = wpe_ajaxobject.captchaSiteKey;
	var secretKey = wpe_ajaxobject.captchaSecretKey;
	const form 	  = $('form').hasClass('wpe-register-form') ? $('#wpe-register-form') : $('#wpe-subscribe-form');

	form.submit(function (e) {
		e.preventDefault();
		if( $('span.g-recaptcha').text() === 'Captcha not found.' ) {
			submitForm( form );
		} else { 
			if( wpe_ajaxobject.captchaType === 'checkbox' && siteKey !== '' && secretKey !== '' ) {
				if ( wpeValidRecaptcha() ) {
					wpeVerifyCaptcha( form );
				}
			} else 
			if( wpe_ajaxobject.captchaType === 'invisible' && siteKey !== '' && secretKey !== '' ) {
				grecaptcha.execute();
				setTimeout( function() {
					wpeVerifyCaptcha( form );
				}, 1000);
			}
		}
	});

	function submitForm( submittedForm ) {
		// Serialize the data in the form
		const serializedData = submittedForm.serializeJSON();
		const action 		 =  $('form').hasClass('wpe-register-form') ? 'wpe_registration_form' : 'wpe_subscribe_form';
		wpe_save_form_data(serializedData, action);
	}

	/**
	 * ajax request for handling saving of form data
	 * 
	 * @param {string} serializedData 
	 * @param {string} action 
	 * 
	 * @since 1.2.0
	 */
	function wpe_save_form_data(serializedData, action) {
		jQuery.ajax({
			url: wpe_ajaxobject.ajaxurl,
			type: 'post',
			data: {
				action: action,
				form_data: serializedData
			},

			// pre-request callback function.
			beforeSend: function () {
				$('#wpe-button').attr('disabled', true);
				$('.wpe-button-loader').fadeIn();
			},

			// function to be called if the request succeeds.
			success: function (response) {
				$('#wpe-button').attr('disabled', false);
				window.location.href = decodeURIComponent(response.url);
				$('.wpe-button-loader').fadeOut();
			}
		})
	}

	//on event single page
	if ( $('body').hasClass('single-wp_events') || $('body').hasClass('post-type-archive-wp_events') ) {
		if (window.location.href.includes('thankyou')) {
			$('.thankyou-popup').css('display', 'block');
			setTimeout(function () {
				$('.thankyou-popup').fadeOut();
				//clean parameters from url
				var clean_uri = window.location.href.substring(0, window.location.href.indexOf("?"));
				window.history.replaceState({}, document.title, clean_uri);
			}, 3000)
		}
	}

	/**
	 * Additional Guests for webinars
	 * */
	const box = '<div class="wpe-col-2 wpe-field guest-box">' + $('.guest-box').html() + '</div>';
	const guest_info = $('.guest-info');
	guest_info.empty();
	$('#event-seats').on('change', function (e) {
		let optionSelected = $("option:selected", this);
		let valueSelected = this.value;
		if (valueSelected > 1) {
			let guest_length = $('.guest-info .guest-box').length;
			if (guest_length >= valueSelected) {
				for (let i = valueSelected; i < guest_length + 1; i++) {
					$(".guest-box").last().remove()
				}
			}
			for (let i = guest_length; i < valueSelected - 1; i++) {
				guest_info.append(box.replaceAll('Guest', 'Guest ' + (i + 1)));
			}
			$('.wpe-guest-field').prop('required', true);
		} else {
			guest_info.empty();
			$('.wpe-guest-field').prop('required', false);
		}
	});

	// on Download ics File click
	$(document).on('click', '#download-ics', function (e) {
		e.preventDefault();
		downloadics();
	});

	/**
	 * On details button click show/hide event description on archive page
	 *
	 * @since 1.0.449
	 * */
	$(document).on('click', '.wpe-detail-button', function () {
		jQuery(this).toggleClass('wpe-active');
		if (jQuery(this).next().hasClass('wpe-display-none')) {
			jQuery(this).next().removeClass('wpe-display-none');
			jQuery(this).parent().addClass('wpe-full-wd');
			jQuery(this).next().fadeIn();
		} else {
			jQuery(this).next().addClass('wpe-display-none');
			jQuery(this).parent().removeClass('wpe-full-wd');
			jQuery(this).next().fadeOut();
		}
	});


});

function validURL( str ) {
	var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
		'(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
	return !!pattern.test(str);
}

/**
 * Gets text data for ics File and creates it
 * */
function makeTextFile( text ) {
	var textFile = null;
	var data = new Blob([text], { type: 'text/plain' });

	// If we are replacing a previously generated file we need to
	// manually revoke the object URL to avoid memory leaks.
	if (textFile !== null) {
		window.URL.revokeObjectURL(textFile);
	}

	textFile = window.URL.createObjectURL(data);

	return textFile;
}

/**
 * Creates download link for ics File
 * */
function downloadics() {
	textbox = jQuery("div.ics-text").text();
	var link = document.createElement('a');
	link.href = makeTextFile(textbox);
	link.download = jQuery("div.filename").text();
	link.click();
}

//display popup on current page
function wpe_popup( message, image = 0 ) {
	jQuery('body').prepend('<div class="wpe-popup"><div class="popup-inner"><span class="close-btn"></span><p>' + message + '</p></div></div>');
	if ( image != 0 ) {
		jQuery('.popup-inner').prepend( '<img src="' + image + '">' );
	}
	setTimeout(function () {
		jQuery('.wpe-popup').fadeOut();
	}, 3000);
}

function CaptchaExpired() {
	const form = $('form').hasClass('wpe-register-form') ? $('#wpe-register-form') : $('#wpe-subscribe-form');
	grecaptcha.reset();
	if( wpe_ajaxobject.captchaType === 'invisible' ) {
		alert('Captcha Verification Expired.\nPlease fill the form again.');
		form.trigger("reset");
	}
}