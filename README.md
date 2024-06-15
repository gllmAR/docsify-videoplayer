# docsify-videoplayer
Docsify video player is a plugin for Docsify that replace markdown link to video file with a video player

turn 
```
 ![a video](/media/ipsum_020.mp4)
```
to 

![a video that work on docsify pages](/media/ipsum_020.mp4)


## Demo 

[docsify-videoplayer-demo](https://gllmar.github.io/docsify-videoplayer/#/)

## tests

### relative links

[relative link](subfolder/)

### thumbnail -> poster
[thumbnail poster](thumbnailposter.md)

* [![ipsum_020](./media/thumb_ipsum_020.webp)](./media/ipsum_020.mp4)

### in lists

* ![a video](/media/ipsum_020.mp4)

* ![another video with relative link](media/ipsum_030.mp4)


### in table

| ![A](/media/ipsum_020.mp4) | ![B](/media/ipsum_030.mp4) |
|- | -|
| ![C](/media/ipsum_040.mp4)  | ![D](/media/ipsum_050.mp4)  |

### from a drag drop via github web interface

#### Video

Search for url with github and assets, assume mp4 extention if founded. Could lead to problem. 

10 megs max with free account

https://github.com/gllmAR/docsify-videoplayer/assets/7544151/873020c0-9460-4338-a4ae-514af807eb9d

#### Gif 
(unaffected because github put it in a image tag)

```
![200w](https://github.com/gllmAR/docsify-videoplayer/assets/7544151/b1858a0f-19a4-4207-9eae-c69540eeb73b)
```

![200w](https://github.com/gllmAR/docsify-videoplayer/assets/7544151/b1858a0f-19a4-4207-9eae-c69540eeb73b)

