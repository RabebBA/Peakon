import multer from 'multer';
import path from 'path';

// Définir où les fichiers téléchargés doivent être stockés
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../client/public'); // Dossier où les fichiers seront enregistrés
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Utilise l'extension originale du fichier
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!') as any, false);
  }
};

// Créer l'instance de Multer
const upload = multer({
  storage,
  fileFilter,
});

export default upload;
