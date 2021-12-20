const fs = require("fs")
const path = require("path")
const jimp = require("jimp")

let imageName = process.argv[2]
let outpath = process.argv[3]

/**
 * delete dir function
 * @param  {String} url
 * @return {Null}
 */
 function deleteDir(url){
    var files = [];
        
    if( fs.existsSync(url) ) {
           
        files = fs.readdirSync(url);
        files.forEach(function(file,index){
            var curPath = path.join(url,file);
                
            if(fs.statSync(curPath).isDirectory()) {
                deleteDir(curPath);
            } else {    
                fs.unlinkSync(curPath);
            }
                
        });
           
        fs.rmdirSync(url); //Clean Dir
    }

}

async function Convert(input,output,size) {
	// Read the image.
	let image = await jimp.read(input);

	await image.resize(size,size,jimp.RESIZE_BEZIER);

	// Save and overwrite the image
	await image.writeAsync(output);
}

let config = JSON.parse(fs.readFileSync("config.json",{
    encoding:"utf-8"
}))

if(fs.existsSync(imageName)){
    deleteDir(outpath)
    fs.mkdirSync(outpath)
    config.AllSize.forEach(element => {
        let outimgpath = path.join(outpath,(config.Prefix+"-"+element.key).toLowerCase())
        deleteDir(outimgpath)
        fs.mkdirSync(outimgpath)
        let file = path.join(outimgpath,config.FileName)
        if(fs.existsSync(file)){
            fs.unlinkSync(file)
        }
        Convert(imageName,path.join(outimgpath,config.FileName),element.size)
    });

}else{
    console.log("No Such File");
}
