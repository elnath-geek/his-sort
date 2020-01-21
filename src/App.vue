<template>
  <v-app>
    <v-content>
      <v-container>
        <v-row>
          <v-col cols="6" md="3">
            <h1>how to use</h1>
            <ol class="mb-3" style="font-size: 14px;">
              <li>ソートする写真が入ったフォルダを選択する</li>
              <li>写真を出力する元フォルダを選択する</li>
              <li>コピーするフォルダを選ぶ</li>
              <li>フォルダにコピーを押す</li>
            </ol>
            <div class="center">
              <v-btn outlined tile color="primary" @click="showDetails(1)">詳しくはこちら</v-btn>
            </div>
          </v-col>
          <v-col cols="6" md="2" class="pl-0">
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
            <div>
              <v-btn tile block x-large @click="popAddFolder(1)">フォルダを<br>追加する</v-btn>
            </div>
          </v-col>
          <v-col cols="6" md="4" class="px-1">
            <canvas id="canvas" @click="popImage(1)"></canvas>
          </v-col>
          <v-col cols="6" md="3">
            <div class="d-flex justify-space-between">
              <v-btn tile @click="changeImage(-1)">戻る</v-btn>
              <div class="align-self-center">{{num+1}}/{{length}}</div>
              <v-btn tile @click="changeImage(1)">進む</v-btn>
            </div>
            <div class="my-2">
              ←写真クリックで拡大できます。
            </div>
            <div class="my-2">
              <v-btn tile block @click="sortFoldertree">フォルダソート</v-btn>
            </div>
            <div class="my-2">
              <v-btn tile block x-large color="primary" @click="copyFile">フォルダに<br>コピー</v-btn>
            </div>
          </v-col>
        </v-row>
        <div class="checkbox-wrapper">
          <v-checkbox
            class="checkbox"
            v-for="folder in folder_tree"
            :key="folder.path"
            :label="folder.name + '　　　　　　　　　'"
            v-model="folder.flag"
            hide-details
            color="primary"
            :style="bgColor(folder)"
          ></v-checkbox>
        </div>
      </v-container>
      <div class="popup" id="details">
        <div class="layer" @click="showDetails(0)"></div>
        <v-card class="details">
          <v-card-text class="text--primary">
            <h1 class="my-4">詳しい使い方</h1>
            <ol>
              <li class="my-2">
                まず、ソートする写真が入ったフォルダを選択して下さい。システム上、指定したフォルダの直下にあるファイルだけを認識します。指定したフォルダの中のフォルダの写真とかは無視しますのでお気を付けください。写真じゃないファイル（.txt等）にも反応するので、写真以外は入れないようにしてください（右上の数字がバグるかと）。
              </li>
              <li class="my-2">
                写真を出力する元フォルダを選択してください。選択したフォルダ内にあるすべてのフォルダを選択肢として、下にカラフルに表示するになっています。一度フォルダを表示したあと、色が揃うようにソートされるはずです。されなかったら、右上にある「フォルダソート」ボタンを押して下さい。
              </li>
              <li class="my-2">
                右上に写真が表示されるので、その写真を入れたいフォルダを下のカラフルなフォルダ群からすべて選択してください。写真が横向きにしか表示されないのは仕様です（ごめんなさい）。入れたいフォルダがない！　といった時は、「フォルダを追加する」ボタンを押してください。追加したいフォルダの位置と、追加したいフォルダ名を入力する画面があるので、それぞれを入力して ADD FOLDER を押すと（フォルダ名入力 ＋ Enterでもいけます）フォルダが追加された上で、カラフルフォルダ群がリセットされます。ソートされない場合は右上のボタンを押してください。
              </li>
              <li class="my-2">
                写真をコピーするフォルダを選択し終えたら右上の青いボタン「フォルダにコピー」を押してください。選択したフォルダに写真がコピーされ、フォルダ群のチェックがはずれ、次の写真が表示されます。そしたら、また手順3から進んでください。
              </li>
              <li class="my-2">
                右上には今何枚目の写真（正確にはファイル）かが表示されます。「戻る」「進む」ボタンで前後の写真に進むことができます。なお、「フォルダにコピー」はフォルダを選択してないと通知だけでて何もおきません。次の写真に進みたい場合は、「進む」ボタンをお使いください。
              </li>
              <li class="my-2">
                最後の写真まで進むと通知がでて写真が変わらなくなるので、ソートする写真が入ったフォルダを選択し直してください。
              </li>
            </ol>
            <h2 class="my-3">補足</h2>
            <ul>
              <li class="my-2">
                これとか、黒背景になんかでてるとき（以下ポップアップ）は黒い部分を押すと消えます。写真もクリックすると拡大されるのですが、写真が出てないときもクリックで拡大されるので、適当に画面の端っこの方をクリックすれば消えます。
              </li>
              <li class="my-2">
                画面幅600pxぐらいまではレスポンシブ対応っぽいことをしましたが、おとなしく大画面で使ってください…。960px以上推奨です。
              </li>
              <li class="my-2">
                なんか動かないなーって時は、再起動とかいろんなボタン押してみるとか、頑張って下さい（笑）再現性のあるバグだったら報告していただければ対応するかもしれません。
              </li>
            </ul>
            <p class="my-3">
              制作：山本恒輔（MF93 it@App）<br>
              お問い合わせ：k-yamamoto93@g.ecc.u-tokyo.ac.jp, もしくは任意のSNS
            </p>
          </v-card-text>
        </v-card>
      </div>
      <div class="popup" id="popup">
        <div class="layer" @click="popImage(0)"></div>
        <canvas id="popup-canvas"></canvas>
      </div>
      <div class="popup" id="addFolder-wrapper">
        <div class="layer" @click="popAddFolder(0)"></div>
        <v-card class="addFolder-form mx-auto" max-width="400" outlined>
          <v-card-text>
            <div class="text--primary">フォルダを追加したい場所を選択したのち、追加するフォルダ名を入力してください。</div>
          </v-card-text>
          <v-card-text>
            <v-file-input
              label="select an add folder path"
              webkitdirectory
              @change="setAddFolder"
            ></v-file-input>
          </v-card-text>
          <v-card-text>
            <v-text-field
              v-model="add_folder_name"
              label="type an add folder name"
              @keyup.enter="addFolder"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn tile block color="primary" @click="addFolder">add folder</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-content>
  </v-app>
</template>

<script>
// import HelloWorld from "./components/HelloWorld";
import * as fs from "fs"
import path from "path"

export default {
  name: "App",
  data: () => ({
    files:[],
    length: 0,
    num: -1,
    input_folder: "",
    output_folder: "",
    add_folder_path: "",
    add_folder_name: "",
    folder_tree:[],
    colors:[
      [230,   0,  18],
      [235,  97,   0],
      [243, 152,   0],
      [252, 200,   0],
      [255, 251,   0],
      [207, 219,   0],
      [143, 195,  31],
      [ 34, 172,  56],
      [  0, 153,  68],
      [  0, 155, 107],
      [  0, 158, 150],
      [  0, 160, 193],
      [  0, 160, 233],
      [  0, 134, 209],
      [  0, 104, 183],
      [  0,  71, 157],
      [ 29,  32, 136],
      [ 96,  25, 134],
      [146,   7, 131],
      [190,   0, 129],
      [228,   0, 127],
      [229,   0, 106],
      [229,   0,  79],
      [230,   0,  51]
    ]
  }),
  methods: {
    bgColor(folder){
      const color = folder.color % 24;
      const opacity = 0.4 - 0.09 * folder.depth ;
      let ret = "background-color: rgba(" + this.colors[color][0] +", " +  this.colors[color][1] +", " +this.colors[color][2] +", " + opacity + ");";
      if(folder.depth == 0){
        ret += "font-weight: bold;"
      }
      return ret;
    },
    setInputFolder(folder){
      // console.log("setInputImage");
      this.num = 0;
      if(folder == null) return 0;
      this.files.length = 0;
      this.input_folder = folder.path;
      fs.readdir(this.input_folder, {withFileTypes: true}, (err, dirents) =>{
        if(err) throw err;
        else{
          const files = dirents.filter((dirent) => dirent.isFile() ).map(({name}) => name)
          this.length = files.length;
          this.files = files;
        }
        this.showImage()
      })
    },
    setOutputFolder(folder){
      // console.log("setOutputImage");
      this.folder_tree.length = 0;
      if(folder == null) return 0;
      this.output_folder = folder.path;
      fs.readdir(this.output_folder, {withFileTypes: true}, (err, dirents)=>{
        if(err) throw err;
        else{
          let color_num=0;
          let depth=0;
          dirents.sort((a,b)=>{
            return a.name > b.name ? 1 : -1;
          })
          for(const dirent of dirents){
            if(dirent.isDirectory()){
              const dir_path = dirent.name
              const data = {
                path: dir_path,
                name: dirent.name,
                flag: false,
                color: color_num,
                depth: 0
              }
              this.folder_tree.push(data);
              this.searchFolder(dir_path, color_num, depth+1)
              color_num++;
            }
          }
        }
      })
      setTimeout(()=>{
        this.sortFoldertree()
      }, 3000)
    },
    searchFolder(dir_path, color_num, depth){
      fs.readdir(path.join(this.output_folder, dir_path), {withFileTypes: true}, (err, dirents)=>{
        if(err) throw err;
        else{
          for(const dirent of dirents){
            if(dirent.isDirectory()){
              const new_path = path.join(dir_path, dirent.name)
              const data = {
                path: new_path,
                name: dirent.name,
                flag: false,
                color: color_num,
                depth: depth
              }
              this.folder_tree.push(data);
              this.searchFolder(new_path, color_num, depth+1)
            }
          }
        }
      })
    },
    sortFoldertree(){
      // console.log("sortFoldertree")
      this.folder_tree.sort((a,b)=>{
        return a.path > b.path ? 1 : -1
      })
    },
    popAddFolder(flag){
      // console.log("popAddFolder");
      const form = document.getElementById("addFolder-wrapper");
      if(flag){
        form.style.display = "block";
      }else{
        form.style.display = "none";
      }
    },
    setAddFolder(folder){
      // console.log("setAddFolder");
      if(folder == null) return 0;
      this.add_folder_path = folder.path
    },
    addFolder(){
      // console.log("addFolder");
      if(this.add_folder_path == "" || this.add_folder_name == ""){
        alert("select an add folder path and addfolder name");
        return 0;
      }
      const mkdir_path = path.join(this.add_folder_path, this.add_folder_name)
      fs.mkdir(mkdir_path, (err)=>{
        if(err) throw err;
        // else console.log("folder add succeeded!");
        this.add_folder_name = "";
      })
      const tmp_folder = {
        path: this.output_folder
      }
      this.popAddFolder(0);
      this.setOutputFolder(tmp_folder);
    },
    popImage(flag){
      // console.log("popImage");
      const popup = document.getElementById("popup");
      if(flag){
        popup.style.display = "block";
      }else{
        popup.style.display = "none";
      }
    },
    copyFile(){
      // console.log("copyFile");
      const file = this.files[this.num];
      let paths = [];
      for(let folder of this.folder_tree){
        if(folder.flag) {
          paths.push(folder.path);
          folder.flag = false;
        }
      }
      if(paths.length == 0){
        alert("file is not selected")
        return 0;
      }
      for(let folder_path of paths){
        fs.copyFile( path.join(this.input_folder, file), path.join(this.output_folder, folder_path, file), fs.constants.COPYFILE_EXCL, (err) =>{
        if(err) throw err;
        // else console.log('file copy succeeded!');
        })
      }
      this.changeImage(1);
    },
    changeImage(d){
      // console.log("changeImage");
      this.num += d;
      if(this.num < 0){
        this.num = 0;
        alert("これより前の写真はありません。")
      }
      if(this.num >= this.length){
        alert("これ以上写真はありません。違うフォルダを選択してください。")
        this.num = this.length - 1;
        return 0;
      }
      this.showImage();
    },
    showImage(){ // 横向き問題未解決
      // console.log("showImage");
      const canvas = document.getElementById("canvas");
      let context = canvas.getContext("2d");
      const p_canvas = document.getElementById("popup-canvas");
      let p_context = p_canvas.getContext("2d");
      let image = new Image();
      let p_image = new Image();
      const photo_path = path.join(this.input_folder, this.files[this.num]);
      fs.readFile(photo_path, (err, data)=>{
        if (err) throw err;
        const base64_data = "data:image/jpeg;base64," + data.toString( 'base64' );
        image.src = base64_data;
        image.onload = ()=>{
          let canvas_width, canvas_height=200;
          const ratio = image.width / image.height;
          canvas_width = canvas_height * ratio;
          canvas.height = canvas_height;
          canvas.width = canvas_width;
          context.clearRect(0, 0, canvas_width, canvas_height);
          context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas_width, canvas_height);
        }
        p_image.src = base64_data;
        p_image.onload = ()=>{
          let canvas_width, canvas_height=800;
          const ratio = image.width / image.height;
          canvas_width = canvas_height * ratio;
          p_canvas.height = canvas_height;
          p_canvas.width = canvas_width;
          p_context.clearRect(0, 0, canvas_width, canvas_height);
          p_context.drawImage(p_image, 0, 0, image.width, image.height, 0, 0, canvas_width, canvas_height);
        }
      })
    },
    showDetails(flag){
      // console.log("showDetails");
      const details = document.getElementById("details");
      if(flag){
        details.style.display = "block";
      }else{
        details.style.display = "none";
      }
    }
  }
}
</script>
<style scoped>
.flex{
  display: flex;
}
.center{
  text-align: center;
}
.checkbox-wrapper{
  display: flex;
  flex-wrap: wrap;
}
.checkbox{
  display: inline-block;
  width: 16.66%;
  margin: 0px;
  padding: 5px;
  border: 1px solid #eeeeee;
  color: black;
  white-space: nowrap;
  overflow: hidden;
}
.popup{
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.layer{
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
}
.details{
  position: absolute;
  top: 80px;
  left: 20%;
  right: 20%;
  bottom: 10%;
  overflow-Y: scroll;
}
#popup-canvas{
  position: absolute;
  top: 10%;
  left: 10%;
  right: 10%;
  bottom: 10%;
  width: 80%;
}
.addFolder-form{
  position: absolute;
  top: 80px;
  left: 20%;
  right: 20%;
  margin: 0 auto;
}
</style>
