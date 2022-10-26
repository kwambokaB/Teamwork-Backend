/* eslint-disable consistent-return */
/* eslint-disable import/no-import-module-exports */
/* eslint-disable no-console */
import dotenv from 'dotenv';
import { Pool } from 'pg';
import cloudinary from 'cloudinary';

dotenv.config();

let pool;
if (process.env.NODE_ENV === 'production') {
  // On production server using heroku db connection string
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
} else if (process.env.NODE_ENV === 'test') {
  pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
} else {
  // created a Pool using local env default config on local
  pool = new Pool({ connectionString: process.env.DEV_DATABASE_URL });
}

exports.createGif = async (req, res) => {
    try{
        cloudinary.v2.uploader.upload(req.body.image, 
            { 
              resource_type: "video", 
              public_id: "myfolder/mysubfolder/dog_closeup",
              chunk_size: 6000000,
              eager: [
              { width: 300, height: 300, crop: "pad", audio_codec: "none" }, 
              { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" } ],                                   
              eager_async: true,
              eager_notification_url: "https://mysite.example.com/notify_endpoint" 
            },
        function(error, result) {console.log(result, error)});

    }catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 'error',
      error: err.message,
    });
  }
}


{ 
    public_id: 'cr4mxeqx5zb8rlakpfkg',
    version: 1571218330,
    signature: '63bfbca643baa9c86b7d2921d776628ac83a1b6e',
    width: 864,
    height: 576,
    format: 'jpg',
    resource_type: 'image',
    created_at: '2017-06-26T19:46:03Z',
    bytes: 120253,
    type: 'upload',
    url: 'http://res.cloudinary.com/demo/image/upload/v1571218330/cr4mxeqx5zb8rlakpfkg.jpg',
    secure_url: 'https://res.cloudinary.com/demo/image/upload/v1571218330/cr4mxeqx5zb8rlakpfkg.jpg' 
  }