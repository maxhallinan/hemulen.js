#Hemulen.js

##Introduction

###Overview

Hemulen.js facilitates building forms with drag&#45;and&#45;drop file upload fields. A drag&#45;and&#45;drop field is created by instantiating the `Hemulen` class. A `Hemulen` instance is bound to one or more DOM elements containing a drag&#45;and&#45;drop field and an optional file input. The `Hemulen` class can be instantiated multiple times per form, enabling differences of behavior among fields. When the form is submitted, files uploaded to each of the drag&#45;and&#45;drop fields and the values of all other fields will be submitted as a single asynchronous request. The request is made to the value of the form's action attribute.

Hemulen.js has three primary functions: managing data, sending data to the server, and dispatching events that describe the application's state. When a file is dropped on a drag&#45;and&#45;drop field, Hemulen validates the file against the validation criteria specified for that Hemulen instance. If the validation fails, the element to which the instance is bound emits a Hemulen error event. If the validation succeeds, the element emits the `hemulen-filestored` event and the file is placed in storage.

Hemulen file storage:

    |- Hemulen File Storage object
    |   |- namespace
    |   |   |- instanceId
    |   |   |   |- fileId
    |   |   |   |   |- file
    |   |   |   |   |- foo
    |   |   |   |   |- bar

Hemulen file storage can be accessed and manipulated using the Hemulen API. Capabilities include referencing a stored file, removing a file from storage, or associating additional values with a stored file (such as `foo` and `bar` in the above diagram). After the form registers the submit event but before the POST request is made, this tree structure is flattened into a series of key/value pairs. The key names follow this naming pattern: `namespace[instance number]property[file number]`. Thus, if a form contained one Hemulen instance with a namespace of `galleryimages` and that instance was bound to two elements, and two images had been dropped on each of those elements, the request body would include four files stored under these key names: 

- `galleryimages0file0`;
- `galleryimages0file1`;
- `galleryimages1file0`; 
- `galleryimages1file1`.

If a `title` value had been associated with each of these files, the request body would include an additional four values stored under these key names:

- `galleryimages0title0`;
- `galleryimages0title1`;
- `galleryimages1title0`; 
- `galleryimages1title1`.

Hemulen.js does not:

- manipulate the DOM in any way, including:
    + generate UI components,
    + generate file thumbnails,
    + list dropped files,
    + display validation or error messages;
- test browser compatability;
- provide a browser compatability fallback.

All of these things are better handled by the application. By subscribing to Hemulen events and using the Hemulen API, these tasks and features can be easily accomplished and accomplished in a manner that best suits the application.

##Reference

- Drag events
- FIle API
- [File List](http://www.w3.org/TR/FileAPI/#filelist-section)
- [File Object](http://www.w3.org/TR/FileAPI/#dfn-file)

##Use

    <form action="/hemulen-form" method="post" enctype="multipart/form-data">
        <div class="foo">
            <div class="foo__drop-field"></div>
            <input class="foo__file-input" type="file" />
        </div>
        <input type="submit" />
    </form>
    
    
    <script type="text/javascript" src="hemulen.js"></script>
    <script>
        var foo = new Hemulen({
            hemulen: '.foo',
            namespace: 'foo',
            fileLimit: 10
        });
    </script>



##Configuration

`options.namespace`

Type: String

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

###General Events

####File Deleted

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

####File Stored

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

###Error Events

####Too Big

Event Name: `hemulen-toobig`

The event emitted by the Hemulen element when the size of a file dropped on the drop input or uploaded through the file input is greater than the value of `options.maxFileSize`. When `hemulen-toobig` is emitted, `hemulen-toobig.detail.file` has not been stored on the data model.  

Properties

- `hemulen-toobig.detail.instance`
    + Type: Element Node
- `hemulen-toobig.detail.instanceId`
    + Type: String
- `hemulen-toobig.detail.file`
    + Type: File Object

####Too Many

Event Name: `hemulen-toomany`

The event emitted by the Hemulen element when the number of files dropped on the drop input or uploaded through the file input is greater than the value of `options.fileLimit`. When `hemulen-toomany` is emitted, no files have been stored on the data model.

Properties:

- `hemulen-toomany.detail.instanceId`
    + Type: String
- `hemulen-toomany.detail.files`
    + Type: File List
- `hemulen-toomany.detail.hemulen`
    + Type: Object

####Wrong Type

Event Name: `hemulen-wrongtype`

The event emitted by the Hemulen element when the mime type of a file dropped on the drop input or uploaded through the file input does not match any of the mime type strings stored in `options.acceptTypes`. When `hemulen-wrongtype` is emitted, `hemulen-toobig.detail.file` has not been stored on the data model.

Properties

- `hemulen-wrongtype.detail.instance`
    + Type: Element Node
- `hemulen-wrongtype.detail.instanceId`
    + Type: String
- `hemulen-wrongtype.detail.file`
    + Type: File Object

###Form Submission Events

####Submission Success

Event Name: `hemulen-subsuccess`

Properties

- `hemulen-subsuccess.detail.request`

####Submission Failure

Event Name: `hemulen-subfail`

Properties

- `hemulen-subfailure.detail.request`


##API

###addData

`Hemulen.addData(instanceId, fileId, data)`

`instanceId`:

`fileId`:

`data`: an object containing values to be associated with the specified file on the data model. These key/value pairs will be sent to the server as form field name/value pairs. The values must be primitives.

###deleteFile

`Hemulen.deleteFile(instanceId, fileId)`

`instanceId`:

`fileId`:

Remove a file and all associated data from the data model. If the file is removed successfully, the `hemulen-filedeleted` event is emitted.

###getInstanceId

`Hemulen.getInstanceId(element)`

`element`: an Element Node to which the Hemulen instance is bound.

Returns the id of that field on the data model.

###storeFiles

`Hemulen.storeFiles(instanceId, files)`

`instanceId`:

`files`: a `FileList` containing one or more `File` objects.

Stores each item of `files` on the data model. When `Hemulen.storeFiles()` is called, the Hemulen instance will emit events as if the files had been dropped on the drop input or uploaded through the file input.

##Browser Compatability


