<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>
    </v-app-bar>

    <v-content>
      <v-container>
        <v-row>
          <v-col cols="6">
            <h1>使い方！</h1>
            <ol>
              <li>写真が入ったフォルダを選択する</li>
              <li>出力するフォルダを選択する</li>
              <!-- <li>出力フォルダツリー構造を指定する</li> -->
            </ol>
            <v-file-input
              label="select a photo folder"
              webkitdirectory
              directory
              @change="setInputFolder"
            ></v-file-input>
            <v-file-input
              label="select an output folder"
              webkitdirectory
              @change="setOutputFolder"
            ></v-file-input>
            <canvas id="canvas"></canvas>
          </v-col>
          <v-col cols="6">
            <v-container style="padding: 0px">
              <v-checkbox
                class="checkbox"
                v-for="folder in folder_tree"
                :key="folder.path"
                :label="folder.name"
                v-model="folder.flag"
                hide-details
              ></v-checkbox>
            </v-container>
            <v-btn
              @click="copyFile"
            >copy!</v-btn>
            <v-btn
              @click="showImage"
            >show!</v-btn>
            <div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
// import HelloWorld from "./components/HelloWorld";
import * as fs from "fs"
import loadImage from "blueimp-load-image"

export default {
  name: "App",

  data: () => ({
    files:[],
    length: 0,
    num:0,
    input_folder: "",
    output_folder: "",
    folder_tree:[
      // {
      //   path: "/folder/name",
      //   name: "folder_name",
      //   flag: false,
      // }
    ]
  }),
  methods: {
    setInputFolder(folder){
      this.input_folder = folder.path;
      fs.readdir(this.input_folder, (err, files) =>{
        if(err) throw err;
        else{
          this.length = files.length;
          this.files = files;
        }
        this.showImage()
      })
    },
    setOutputFolder(folder){
      this.output_folder = folder.path;
      fs.readdir(this.output_folder, {withFileTypes: true}, (err, dirents)=>{
        if(err) throw err;
        else{
          dirents.sort((a,b)=>{
            return a.name > b.name ? 1 : -1
          })
          for(const dirent of dirents){
            if(dirent.isDirectory()){
              const path = "/" + dirent.name
              const data = {
                path: path,
                name: dirent.name,
                flag: false
              }
              this.folder_tree.push(data);
              this.searchFolder(path)
            }
          }
        }
      })
    },
    searchFolder(path){
      fs.readdir(this.output_folder + path, {withFileTypes: true}, (err, dirents)=>{
        if(err) throw err;
        else{
          for(const dirent of dirents){
            if(dirent.isDirectory()){
              const new_path = path + "/" + dirent.name
              const data = {
                path: new_path,
                name: dirent.name,
                flag: false
              }
              this.folder_tree.push(data);
              this.searchFolder(new_path)
            }
          }
        }
      })
    },
    copyFile(){ // 指定したフォルダにはまだできてない
      const file = "\\" + this.files[this.num];
      fs.copyFile(this.input_folder + file, this.output_folder + file, fs.constants.COPYFILE_EXCL, (err) =>{
        if(err) throw err;
        else console.log('file copy succeeded!');
      })
    },
    showImage(){ // 横向き問題未解決
      const canvas = document.getElementById("canvas");
      let context = canvas.getContext("2d");
      let image = new Image();
      const path = this.input_folder + "\\" + this.files[this.num];
      fs.readFile(path, (err, data)=>{
        if (err) throw err;
        const base64_data = "data:image/jpeg;base64," + data.toString( 'base64' );
        image.src = base64_data;
        image.onload = ()=>{
          let canvas_width=480, canvas_height;
          const ratio = image.height / image.width;
          canvas_height = 480 * ratio;
          canvas.width = canvas_width;
          canvas.height = canvas_height;
          context.clearRect(0, 0, canvas_width, canvas_height);
          context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas_width, canvas_height);
        }
        this.num++;
        if(this.length <= this.num) this.num = 0;
      })
    },
    showImage1(){ // 横向き解消できなかったやつ
      const path = this.input_folder + this.files[this.num];
      loadImage.parseMetaData(path, (data)=>{
        const options={
          maxWidth: 500,
          canvas: true
        };
        console.log(data);
        if(data.exif){
          options.orientation = data.exif.get("Orientation");
        }
      })
    }
  }
};
</script>
<style scoped>
.checkbox{
  display: inline-block;
  margin: 5px;
  padding: 10px 10px 10px 5px;
  /* background-color: #f5f5f5; */
  border: 3px solid #eeeeee;
}
</style>
