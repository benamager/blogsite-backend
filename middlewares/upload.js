import multer from "multer"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/userImages')
  },
  filename: function (req, file, cb) {
    const extension = file.mimetype.split("/").pop()
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + "." + extension)
  }
})

export default multer({ storage: storage })