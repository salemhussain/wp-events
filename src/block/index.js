//  Import CSS.
// import 'editor.css';
// import 'style.css';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { InspectorControls, RichText, InnerBlocks } = wp.editor;
const { ToggleControl, PanelBody, PanelRow, CheckboxControl, SelectControl, ColorPicker  } = wp.components;
const { Fragment , useState } = wp.element;



 const postSelections = [];

 const allPosts = wp.apiFetch({path: "/wp/v2/wpevents-category"}).then(taxonomy => {
	 postSelections.push({label: "Select a Category", value: 0});
	 jQuery.each( taxonomy, function( key, val ) {
		 postSelections.push({label: val.name, value: val.id});
	 });
	 return postSelections;
 });



registerBlockType( 'wp-events/shortcode-block-list', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'WPE ShortCode Block' ), // Block title.
	icon: 'calendar-alt', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'seminar' ),
		__( 'webinar' ),
		__( 'event' ),
	],

attributes: {
	
	toggle: {
		type: 'boolean',
		default: true
	},
	title: {
		type: 'string',
	},
	eventNumber:{
		type: 'number',
	},
	buttonText:{
		type: 'string',
	},
	favoriteAnimal: {
		type: 'string',
		default: 'Big'
	},
	catSelect: {
		type: 'string',
		default: '#DDDDDD'
	},
	

},

edit: (props) => { 
	
	const { attributes, setAttributes , selectedPost , onChangePost } = props;
	
	
	return ([
		<div>
			<InspectorControls>
				<PanelBody
					title="Settings"
					initialOpen={true}
				>
					<PanelRow className={ props.className }>
						<h3>Title</h3>,
							<RichText
								tagName="p"
								value={ attributes.title }
								onChange={ (newval) => setAttributes({ title: newval }) }
								placeholder={ __( 'Add Subscription form title' ) }
							/>
					</PanelRow>
					<PanelRow>
					<h3>Category</h3>,
							<SelectControl
									
									value={ attributes.catSelect }
									options={ postSelections }
									onChange={(newval) => setAttributes({ catSelect: newval })}
							/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label="Grid View"
							checked={attributes.toggle}
							onChange={(newval) => setAttributes({ toggle: newval })}
						/>
					</PanelRow>
					<PanelRow className={ props.className }>
						<h3>Events To Display</h3>,
							<RichText
								tagName="p"
								value={ attributes.eventNumber }
								onChange={ (newval) => setAttributes({ eventNumber: newval }) }
								placeholder={ __( 'add 1 to 10 in numbers' ) }
							/>
					</PanelRow>
					<PanelRow className={ props.className }>
						<h3>Button Text</h3>,
							<RichText
								tagName="p"
								value={ attributes.buttonText }
								onChange={ (newval) => setAttributes({ buttonText: newval }) }
								placeholder={ __( 'Button text to display' ) }
							/>
					</PanelRow>
				</PanelBody>
			</InspectorControls> 

			
		</div>,
		<div className={ props.className }>
					<p>Hure! Pleae check a stuning event section at front-end side .  . </p>
				</div>
						]);
},
save: function( props ){
	return null;
  },
});