'use strict';

var router = require('express').Router();
var AV = require('leanengine');

var flash = require('connect-flash');

var async = require('async');
var extend = require("xtend");
var markdown = require("markdown").markdown;
var webshot = require('webshot');
var Array = require('node-array');

//class
var Product = AV.Object.extend('Product');
var Category = AV.Object.extend('Category');
var Banner = AV.Object.extend('Banner');


var title = '产品编辑-预览产品';
var currentPage = 'product';


//预览产品页
router.post('/', function (req, res, next) {

    var mdCodeInfo = req.body['md-code-info'] || '';
    var mdCodeBanner = req.body['md-code-banner'] || '';
    var mdCodeVideo = req.body['md-code-video'] || '';
    var mdCodeName = req.body['md-code-name'] || '';
    var mdCodeReview = req.body['md-code-review'] || '';
    var mdCodeProperty = req.body['md-code-property'] || '';
    var mdCodeInstruction = req.body['md-code-instruction'] || '';
    var mdCodeDetail = req.body['md-code-detail'] || '';
    var mdCodeImage = req.body['md-code-image'] || '';


    var datas = {
        title: title,
        currentPage: currentPage,
        mdCodeInfo: markdown.toHTML(mdCodeInfo),
        mdCodeBanner: markdown.toHTML(mdCodeBanner),
        mdCodeVideo: markdown.toHTML(mdCodeVideo),
        mdCodeName: markdown.toHTML(mdCodeName),
        mdCodeReview: markdown.toHTML(mdCodeReview),
        mdCodeProperty: markdown.toHTML(mdCodeProperty),
        mdCodeInstruction: markdown.toHTML(mdCodeInstruction),
        mdCodeDetail: markdown.toHTML(mdCodeDetail),
        mdCodeImage: markdown.toHTML(mdCodeImage)
    };

    
    
    res.render('product/preview', datas);


});


//shot
router.post('/shot',function(req,res,next) {

    var html = req.body.html;
    var htmlHeight = req.body.htmlHeight;

    html += "<style>body { margin:0; width:750px; font-size:20px;line-height:24px; background: #fff;font-family:'Segoe UI','Lucida Grande','Helvetica','Arial','Microsoft YaHei'; }img {width: 100%;} p {margin:0;padding:0 15px 15px;} </style>";
    
    //淘宝发布的Mobile尺寸最大高度为960，故需要分段
    var segments = new Array(Math.ceil( htmlHeight / 960));
    
    var options = {
        siteType:'html',
        shotSize: {
            width: 750,
            height: 960
        }
    };
    
    segments.forEachAsync(function(segment, index, arr, next) {

        var option = extend(options,{
            shotOffset:{
                left:0,
                right:0,
                top:index * 960,
                bottom:0
            }
        });

        
        webshot(html, 'google'+ index +'.png',option,function(err) {
            
            if(err) {
                res.send(err);
            }
            
            next();
            
        });
            
        return true;
    
    },
    function() {
        res.json({
            "success":1
        });
    });
    
});

module.exports = router;