export const Resources:{ [key:string]: any } = { };

export interface ResourceItem {
	url: string,
	name: string,
	type: 'image' | 'json' | 'xml'
}

// TODO: Depois refazer com Promise ou com rxJS
export function LoadResources(resources: Array<ResourceItem>, callback: any) {
	let filesLoaded = 0;
	resources.forEach((resource) => {
		const { url, type } = resource;

		switch(type) {
			case "image":
				let image = new Image();
				image.src = url;
				image.addEventListener('load', () => {
					filesLoaded += 1;

					Resources[resource.name] = Object.assign(resource, { file: image });

					if (filesLoaded === resources.length) {
						callback(Resources);
					}
				});
				break;
		}
	});
}
