/*
  Copyright 2017 Linux Academy
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

const express = require('express');
const logger = require('morgan');
const multer = require('multer')();
const path = require('path');
const request = require('request');
const url = require('url');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// inject dependencies into req object
app.use((req, res, next) => {
  req.deps = {
    request,
    url,
    filterApiUrl: `http://localhost:${process.env.FILTER_API_PORT}`,
    photoApiUrl: `http://localhost:${process.env.API_PORT}`,
    s3Bucket: process.env.S3_BUCKET,
  };
  next();
});

// Routes: Homepage
app.get('/', require('./routes/homepage'));

// Routes: Upload Image
app.post(
  '/photo',
  multer.single('uploadedImage'),
  require('./routes/multipartToImage'),
  require('./routes/filterGreyscale'),
  require('./routes/upload')
);

module.exports = app;