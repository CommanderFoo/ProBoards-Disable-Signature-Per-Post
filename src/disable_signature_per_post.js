class Disable_Signature_Per_Post {

	static init(){
		this.PLUGIN_ID = "disable_signature_per_post";
		this.PLUGIN_KEY = "pd_disable_signature_per_post"

		this.route = pb.data("route").name;
		this.thread_check = (yootil.location.thread() || yootil.location.recent_posts() || yootil.location.search_results());

		$(this.ready.bind(this));
	}

	static ready(){
		if(yootil.location.posting() || yootil.location.editing()){
			this.create_signature_option();
		}

		if(this.thread_check){
			yootil.event.after_search(() => this.hide_signatures.bind(this)());
			this.hide_signatures();
		}
	}

	static create_signature_option(){
		let post_data = this.get_post_data();
		let form_id = pb.data("form_id");
		let $post_button = $("#" + form_id + "_post_button");
		let $post_button_parent = $post_button.parent();
		let $form = $("#" + form_id);

		if($post_button_parent.length == 1){
			let $option = $("<span class='signature-disabled-per-post-option'><input type='checkbox' value='1' name='disable-signature' /> Disable Signature</span>");
			let $input = $option.find("input:first");

			if(post_data == 1){
				$input.prop("checked", true);
			}

			$post_button_parent.prepend($option);
			$form.on("submit", this.set_on.bind(this, $input));
		}
	}

	static get_post_data(){
		let data = 0;

		if(pb.data("page").post && parseInt(pb.data("page").post.id, 10) > 0){
			let post_id = parseInt(pb.data("page").post.id, 10);

			data = yootil.key.value(this.PLUGIN_KEY, post_id) || 0;
		}

		return data;
	}

	static get_hook(){
		let hook = null;

		if(this.route == "new_post" || this.route == "quote_posts"){
			hook = "post_new";
		} else if(this.route == "new_thread"){
			hook = "thread_new";
		} else if(this.route == "edit_thread"){
			hook = "thread_edit";
		} else if(this.route == "edit_post"){
			hook = "post_edit";
		}

		return hook;
	}

	static set_on($option){
		let hook = this.get_hook();

		if(hook){
			console.log($option);
			console.log(($option.prop("checked"))? 1 : 0);
			yootil.key.set_on(this.PLUGIN_KEY, (($option.prop("checked"))? 1 : 0), null, hook);
		}
	}

	static hide_signatures(){
		let post_ids = proboards.plugin.keys.data[this.PLUGIN_KEY];

		for(let key in post_ids){
			if(parseInt(post_ids[key], 10) === 1){
				let $post = $("#post-" + parseInt(key, 10));

				if($post.length == 1){
					$post.find(".signature").hide();
				}
			}
		}
	}

}