import { fromString } from 'fast-csv'

export default function parseCSV (string, options) {
	return new Promise((resolve, reject) => {
		let content = [];
		fromString(string, options)
			.on("data", function(data){
				content.push(data)
			})
			.on("end", function(){
				resolve(content);
			});
	})
}