#Hemulen

*All around (the hemulen) there were people living slipshod and aimless lives, wherever he looked there was something to be put to rights...*  

&mdash;Tove Jansson, *Moominvalley in November*

*...however hard he tried he remained a hemulen doing his best without anything really coming off. In the end he got up and pulled on his trousers.*

&mdash;Tove Jansson, *Moominvalley in November*

Hemulen.js was written with a grumpiness about JavaScript client-side plugins that make too many assumptions and offer too many features. These plugins violate the [Unix philosophy](https://books.google.com/books?id=5wBQEp6ruIAC&pg=PA76) of "small, sharp tools, each intended to do one thing well." Plugins that fail to meet this standard have proliferated in the universe of client-side code. These plugins, like all plugins, intend to make client-side coding easier. Sometimes they succeed. But the ease afforded by these plugins comes at a cost. That cost is the subjugation of the codebase to a quiet tyranny wherein the plugin dictates (sometimes explicitly, sometimes in effect) aspects of document structure, page styles, and application architecture. Sometimes these dictates are small and easily managed; sometimes they are significant and have significant side-effects. If we start with the belief that every codebase has an ideal form and that the life of the codebase is a movement towards the manifestation of this ideal, then we understand that a plugin's side-effects impede this evolution, warp its form, and degrade that life. In the worst cases, the life of the codebase completely loses the path towards its ideal form, wandering in whatever direction it is pointed by its tools and hoping that it is not told to go in two different directions at once. In those cases, the life of the codebase has become "slipshod and aimless".

The hemulens are great reformers, single-minded about enforcing rules, and as unhappy with themselves as they are with everyone else. So too with Hemulen.js. It is not without side-effects. But it has been written, at least, with regret for those side-effects and with a hope that when the time comes to pull on the trousers and be about the work of building web pages, those side-effects will be small enough to be forgiven. 

 because their

as unhappy with themselves as much as anyone else 

 who fail to meet their impossible standards. 

##Support

##Glossary

- Hemulen class instance
    + An instance of the Hemulen class created by calling the Hemulen constructor.
- Hemulen DOM instance
    + A Hemulen class instance can refer to more than one DOM element. 
- [File List](http://www.w3.org/TR/FileAPI/#filelist-section)
- [File Object](http://www.w3.org/TR/FileAPI/#dfn-file)

##Use

    <form action="" method="post" enctype="multipart/form-data">
        <div id="constable">
            <div class="hemulen__drop-field"></div>
            <input class="hemulen__file-input" type="file" name="hemulen" />
        </div>
        <input type="submit" />
    </form>
    
    
    <script type="text/javascript" src="hemulen.js"></script>
    <script>
        var theConstable = new Hemulen({
            hemulen: '#constable',
            namespace: 'constable',
            fileLimit: 10
        });
    </script>



##Config

`options.namespace`

Type: Selector string

`options.dropInput`

Type: Selector string

`options.fileInput`

Type: Selector string

`options.acceptTypes`

Type: Array of strings 

`options.fileLimit`

Type: Number

`options.fileMaxSize`

Type: Number

`options.beforeSub`

Type: Function

##Events

Hemulen events are DOM events. In addition to the properties and methods common to DOM events, a Hemulen event object contains Hemulen-specific values stored on the `event.detail` property.

###File Stored

Event Name: `hemulen-filestored`

The event emitted by the Hemulen element when a file is dropped on the drop input or uploaded through the file input and successfully stored on the data model.

Event properties:

- `hemulen-filestored.detail.file`
    + Type: File Object
    + The file object that has been successfully stored on the data model.
- `hemulen-filestored.detail.fileId`
    + Type: String
    + The key under which the file has been stored on the data model. **`fileId` should be stored for later use.** Without the value of `fileId`, the file cannot be removed from the data model or updated with additional properties. Unlike the `instanceId`, there is no method to query the data model for a `fileId`. A file whose `fileId` is unknown to the application is stranded on the data model.
- `hemulen-filestored.detail.hemulen`
    + Type: Object
    + Hemulen instance configuration
    + The Hemulen context
- `hemulen-filestored.detail.instanceId`
    + Type: String

###File Deleted

Event Name: `hemulen-filedeleted`

The event emitted by the Hemulen element when a file is removed from the data model. 

Event properties:

- `hemulen-toobig.detail.instance`
    + Type: Element Node
- `hemulen-toobig.detail.instanceId`
    + Type: String
- `hemulen-filestored.detail.hemulen`
    + Type: Object
    + Hemulen instance configuration
    + The Hemulen context

###Too Big

Event Name: `hemulen-toobig`

The event emitted by the Hemulen element when the size of a file dropped on the drop input or uploaded through the file input is greater than the value of `options.maxFileSize`. When `hemulen-toobig` is emitted, `hemulen-toobig.detail.file` has not been stored on the data model.  

Properties

- `hemulen-toobig.detail.instance`
    + Type: Element Node
- `hemulen-toobig.detail.instanceId`
    + Type: String
- `hemulen-toobig.detail.file`
    + Type: File Object

###Too Many

Event Name: `hemulen-toomany`

The event emitted by the Hemulen element when the number of files dropped on the drop input or uploaded through the file input is greater than the value of `options.fileLimit`. When `hemulen-toomany` is emitted, no files have been stored on the data model.

Properties:

- `hemulen-toomany.detail.instanceId`
    + Type: String
- `hemulen-toomany.detail.files`
    + Type: File List
- `hemulen-toomany.detail.hemulen`
    + Type: Object

###Wrong Type

Event Name: `hemulen-wrongtype`

The event emitted by the Hemulen element when the mime type of a file dropped on the drop input or uploaded through the file input does not match any of the mime type strings stored in `options.acceptTypes`. When `hemulen-wrongtype` is emitted, `hemulen-toobig.detail.file` has not been stored on the data model.

Properties

- `hemulen-wrongtype.detail.instance`
    + Type: Element Node
- `hemulen-wrongtype.detail.instanceId`
    + Type: String
- `hemulen-wrongtype.detail.file`
    + Type: File Object

##API

`Hemulen.getInstanceId(element)`

Where `element` is an Element Node and a Hemulen DOM instance, returns the id of that DOM instance within the Hemulen class instance.

`Hemulen.getFileId(instanceId, file)`

`Hemulen.storeFiles(instanceId, files)`

Where `files` is a `FileList` containing one or more `File` objects, `Hemulen.storeFiles()` will store these `File` objects on the data model. This method is called internally to store files that have been dropped on the drop input or uploaded through the file input. When `Hemulen.storeFiles()` is called, the Hemulen instance will emit events as if the files had been dropped on the drop input or uploaded through the file input.

`Hemulen.deleteFile(instanceId, fileId)`

Remove a file and all associate data from the data model. If the file is removed successfully, the `hemulen-filedeleted` event is emitted.

`Hemulen.addData(instanceId, fileId, data)`
