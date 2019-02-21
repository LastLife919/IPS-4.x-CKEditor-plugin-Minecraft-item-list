var addItemStylesLoaded = false;
CKEDITOR.plugins.add( 'addItem', {

	icons: 'addItem',
	beforeInit: function() {
		if ( !addItemStylesLoaded ) {
			CKEDITOR.document.appendStyleSheet( this.path + 'style/default.css' );
			addItemStylesLoaded = true;
		}
	},
	init: function( editor ) {
		path = this.path;
		blocklist = jQuery('<div class="cke-additem" style="display: none;"><input type="text" placeholder="Поиск предметов" class="cke-additem__search"></div>');
		jQuery('[data-ipseditor-name="' + editor.name + '"]').append(blocklist);

		jQuery.ajax( this.path + 'blockdata.json', {
			type: 'get',
			success: function(data){
				var i, j, result = '';
				for (i = 0; i < data.categories.length; i++) {
					result += '<div class="cke-additem__categories" cat="' + i + '">' + data.categories[i].name + '<br>';
					for (j = 0; j < data.categories[i].data.length; j++) {
						posx = j % 25 * 32;
						posy = Math.floor( j/25 ) * 32;
						result += '<img class="cke-additem__sprite" data-ipstooltip data-ipstooltip-label="' + data.categories[i].data[j].name + '" _title="' + data.categories[i].data[j].name + '" src="' + path +'sprites/blank.png" style="background-position: -' + posx + 'px -' + posy + 'px; background-image: url(\'' + path +'sprites/' + i + '.png\')">'
					};
					if(i+1 < data.categories.length) {
						result += '</div><hr style="display: block;">'
					} else {
						result += '</div>'
					}
				};
				blocklist.append(result);

				jQuery('.cke-additem__sprite').on('click', function() {
					var img = jQuery(this);
					editor.insertHtml(img[0].outerHTML);
				});

				jQuery('.cke-additem__search').on("keyup", function() {
					var regBlock = new RegExp(jQuery(this).val(), 'i');
					var i, j;
					for (i = 0; i < data.categories.length; i++) {
						for (j = 0; j < data.categories[i].data.length; j++) {
							var title = jQuery('.cke-additem').find('[_title = "' + data.categories[i].data[j].name + '"]');
							if (regBlock.test(data.categories[i].data[j].name)) {
								title.show();
							} else {
								title.hide();
							};
						};
					};
				});
			}
		});


		editor.addCommand( 'addItem', {
			exec: function( editor ) {
				jQuery('.cke-additem').slideToggle();
			}
		});
		editor.ui.addButton( 'addItem', {
			label: 'Предметы из игры',
			command: 'addItem',
			toolbar: 'insert'
		});
	}
});