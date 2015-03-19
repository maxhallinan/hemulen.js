#Hemulen.js

##Introduction

###Overview

Hemulen.js facilitates building forms with drag&#45;and&#45;drop file upload fields. A drag&#45;and&#45;drop field is created by instantiating the `Hemulen` class. A `Hemulen` instance is bound to one or more DOM elements containing a drag&#45;and&#45;drop field and an optional file input. The `Hemulen` class can be instantiated multiple times per form, enabling differences of behavior among fields. When the form is submitted, files dropped on the drag&#45;and&#45;drop fields will be posted with the form as a single asynchronous request. The request is made to the value of the form's action attribute.

###What Hemulen.js does

Hemulen.js has three primary functions: manage data, send data to the server, and dispatch events that describe actions taken with this data.

####Manage data

When a file is dropped on a drag&#45;and&#45;drop field, Hemulen validates the file against the validation criteria specified for that Hemulen instance. If the file is valid, Hemulen places the file in a data structure where it is held until the form is submitted. Files stored in this data structure are easily accessed and manipulated via the Hemulen API. Capabilities include referencing a stored file, removing a file from storage, and associating additional values with a stored file.

The contents of this data structure are stored in memory. The data does not persist across sessions and *its use is limited in every way that memory use in a browser is limited*. A large number of files or one file of sufficiently large size will exceed a browser's memory limit. Hemulen.js is not a suitable tool for these cases. 

####Send data to the server

Data held in Hemulen's temporary storage and values represented by non-Hemulen form fields are together sent to the server with `multipart/form-data` encoding. As is the case with an average form, data is posted as a set of key/value pairs and the key for a non-Hemulen field is the value of that field's `name` attribute. Form fields that interact with the Hemulen API (e.g., a file input or a field used to collect a value that is then associated with a file via the Hemulen API) should not be given a name attribute. Hemulen generates the keys for all data held in Hemulen storage. Those keys will follow this pattern:

    [instance name][element number][property name][file number]

- `[instance name]`: the value of `options.namespace`
- `[element number]`: a single Hemulen instance can be bound to more than one element. Stored files are grouped first by Hemulen instance and then by the element on which they are dropped. `[element number]` is the zero-based index of that element in the set of elements to which the Hemulen instance is bound. That set is ordered by appearance in the DOM.
- `[property name]`: if the value is a file, `[property name]` is "file". If the value is not a file, it is a value that has been associated with the file using the Hemulen API method `Hemulen.addData`. `.addData` expects an object containing one or more key/value pairs to be associated with the file. When the form is submitted, the key for each of these values will be used as `[property name]`.
- `[file number]`: the zero-based index of a file in the group of files that have been dropped on a drag&#45;and&#45;drop field. Values associated with a file will share that file's `[file number]`. 

#####Example

The `Hemulen` class has been instantiated once and given a namespace of `"galleryimages"`. The instance is bound to two elements, each containing a drag&#45;and&#45;drop field. Two image files have been dropped on the first drag&#45;and&#45;drop field and three image files have been dropped on the second drag&#45;and&#45;drop field. When the form is submitted, the request body includes five key/value pairs. Following the Hemulen naming pattern, the five keys are:

- `galleryimages0file0`;
- `galleryimages0file1`;
- `galleryimages1file0`; 
- `galleryimages1file1`;
- `galleryimages1file2`.

The same form has been modified. When a user drops a file onto one of the two drag&#45;and&#45;drop fields, a text input is added to the form. This text input enables the user to provide a title for each image. The application uses the Hemulen API to associate the value of this field with the respective file. Again, the form is submitted. Now the request body includes an additional five key/value pairs. The additional keys are:

- `galleryimages0title0`;
- `galleryimages0title1`;
- `galleryimages1title0`; 
- `galleryimages1title1`;
- `galleryimages1title2`.

####Dispatch events

###What Hemulen.js does not

- manipulate the DOM in any way, including:
    + generate UI components,
    + generate file thumbnails,
    + list dropped files,
    + display validation or error messages;
- test browser compatability;
- provide a browser compatability fallback.

All of these things are better handled by the application. By subscribing to Hemulen events and using the Hemulen API, these tasks and features are easily accomplished and accomplished in a manner that best suits the application.

##Dependencies

- [Drag and drop DOM events](http://www.w3.org/TR/2011/WD-html5-20110113/dnd.html#dnd)
- [File API](http://www.w3.org/TR/FileAPI/)
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


