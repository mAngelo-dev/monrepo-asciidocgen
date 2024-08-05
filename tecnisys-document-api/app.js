// * CB é uma função de callback.
// Imports
import express from "express";
import multer from "multer";
import cors from "cors";
import zip from "adm-zip";
import fs from 'fs';
import path from 'path';
import asciidoctor from 'asciidoctor'
import pdf from 'html-pdf'
import shell from 'shelljs'
import {setCharset} from "express/lib/utils.js";
// Variables

// Preload
const app = express();
const port = 3001;
app.use(cors());

// Configuration
let corsOptions = {
  origin: "http://localhost:3000",
};

// MemoryAllocation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./tmp");
  },
  // !Ponto de melhoria para apagar os arquivos após o upload!
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// FileFilter e Storage
// * O file filter verifica se o arquivo é um zip, caso não seja, retorna false não enviando o arquivo.
const upload = multer({
  storage: storage,
  limits: {
    //   524288000 =~ 524MB
    fileSize: 1024 * 1024 * 500,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/zip" && file.mimetype !== "application/x-zip-compressed") {
        console.log(file.mimetype)
      cb(new Error("Invalid file"), false);
    } else {
      cb(null, true);
    }
  },
});

app.post('/file', upload.single('file'), (req, res, next) => {
    try {
        const file = req.file;
        const uploadedZip = new zip(file.path);
        const filePath = path.join(`./tmp/extracted/${file.originalname.replace('.zip', '')}`)
        uploadedZip.extractAllTo(filePath, true);
        if (!fs.existsSync(`${filePath}/index.adoc`)) {
            fs.unlink(file.path, (err) => {
                if (err) {
                    throw err
                };
            });
            throw new Error("index.adoc file not found");
        }
        fs.unlink(file.path, (err) => {
            if (err) {
                throw err
            };
        });
        console.log("File extracted at: " + filePath);
        const asciidoctorInstance = asciidoctor()
        const htmlFile = asciidoctorInstance.convertFile(`${filePath}/index.adoc`, {to_file: `${filePath}/index.html`})
        if (htmlFile) {
            shell.exec(`asciidoctor-pdf --theme resources/tecnisys-theme.yml -a pdf-fontsdir="resources/fonts;GEM_FONTS_DIR" ${filePath}/index.adoc`)
            console.log("PDF generated at: " + filePath)
        }
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename=index.pdf')
        res.download(`${filePath}/index.pdf`);
    } catch (e) {
        next(e)
    }
}, (err, req, res, next) => {
    res.status(400).send("File upload error: " + err.message);
});

app.listen(port, () => {
  console.log(`The API is running on ${port}`);
});
