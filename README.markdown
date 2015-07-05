#Hemulen.js
[![Build Status](https://travis-ci.org/maximumhallinan/hemulen.js.svg?branch=master)](https://travis-ci.org/maximumhallinan/hemulen.js)

##Introduction

###Overview

Hemulen.js facilitates building forms with drag&#45;and&#45;drop file upload fields. A drag&#45;and&#45;drop field is created by instantiating the `Hemulen` class. A `Hemulen` instance is bound to one or more DOM elements containing a drag&#45;and&#45;drop field. A single `Hemulen` instance works for one or more forms per page and the `Hemulen` class can be instantiated multiple times per form, enabling differences of behavior among fields. When the form is submitted, files dropped on the drag&#45;and&#45;drop fields will be posted with the form as a single asynchronous request. The request is made to the value of the form's action attribute.

Please visit [the project page](http://maximumhallinan.com/hemulen/) to see a demo and code examples.

###What Hemulen.js does

Hemulen.js has three primary functions: manage data, send data to the server, and dispatch events that describe actions taken with this data.

####Manage data

When a valid file is dropped on a drag&#45;and&#45;drop field, Hemulen places the file in a data structure where it is held until the form is submitted. Files stored in this data structure are easily accessed and manipulated via the Hemulen API. Capabilities include referencing a stored file, removing a file from storage, and associating additional values with a stored file.

The contents of this data structure are stored in memory. The data does not persist across sessions and use of this storage is *limited in every way that memory use in a browser is limited*. A large number of files or one file of sufficiently large size will exceed a browser's memory limit. Hemulen.js is not a suitable tool for forms that accept exceptionally large quantities of data. 

####Send data to the server

Data held in Hemulen's temporary storage and values represented by non-Hemulen form fields are together sent to the server with `multipart/form-data` encoding. As is the case with an average form, data is posted as a set of key/value pairs and the key for a non-Hemulen field is the value of that field's `name` attribute. Form fields that collect values then associated with a stored file should not be given a name attribute. Hemulen.js generates the keys for all data held in Hemulen storage. Those keys follow this pattern:

    [instance name][element number][property name][file number]

- `[instance name]`: the value of `config.namespace`;
- `[element number]`: stored files are grouped first by Hemulen instance and then by the element on which they are dropped. `[element number]` is the zero-based index of that element in the set of elements to which the Hemulen instance is bound. The matched set is ordered by appearance in the DOM;
- `[property name]`: refers either to a file or a value associated with a file. When referring to a file, `[property name]` is "file". When referring to a value associated with a file, `[property name]` is the key for that value;
- `[file number]`: the zero-based index of a file in the group of files that have been dropped on a drag&#45;and&#45;drop field. Values associated with a file will share that file's `[file number]`. 

#####Example

The `Hemulen` class has been instantiated once and given a namespace of `"galleryimages"`. The instance is bound to two elements, each containing a drag&#45;and&#45;drop field. Two image files have been dropped on the first drag&#45;and&#45;drop field and three image files have been dropped on the second drag&#45;and&#45;drop field. When the form is submitted, the request body includes five key/value pairs. Following the Hemulen naming pattern, the five keys are:

- `galleryimages0file0`;
- `galleryimages0file1`;
- `galleryimages1file0`; 
- `galleryimages1file1`;
- `galleryimages1file2`.

Then the application is modified. When a user drops a file onto one of the two drag&#45;and&#45;drop fields, a text input is added to the form. This text input enables the user to provide a title for each image. The application uses the Hemulen API to associate the value of this field with the respective file. Again, two image files have been dropped on the first drag&#45;and&#45;drop field and three image files have been dropped on the second drag&#45;and&#45;drop field. The form is submitted. Now the request body includes an additional five key/value pairs. The additional keys are:

- `galleryimages0title0`;
- `galleryimages0title1`;
- `galleryimages1title0`; 
- `galleryimages1title1`;
- `galleryimages1title2`.

####Dispatch events

A drag&ndash;and&ndash;drop application typically requires features that are dependent upon but beyond the scope of Hemulen.js. For instance, the average drag&ndash;and&ndash;drop interface displays a list of dropped files. Listing a dropped file depends on Hemulen.js for access to file data and confirmation that the file has been placed in Hemulen storage. These dependencies can be satisfied by binding to Hemulen events.

A Hemulen event describes the internal result of an interaction with a Hemulen instance. The event object exposes the Hemulen data upon which these application-specific features depend. Most Hemulen events are emitted by the element to which the Hemulen instance is bound. Form submission events are emitted by the form element. See the Events section for more information.

###What Hemulen.js does not

Hemulen.js is devoted to a single utility: handling data for forms with drag&ndash;and&ndash;drop fields. Hemulen.js is designed to fulfill this utility without making assumptions about or asserting application architecture, and with minimal side effects on application state. For this reason, Hemulen.js does not:

- manipulate the DOM:
    + generate UI components,
    + generate file thumbnails,
    + list dropped files,
    + display validation or error messages;
- provide a browser compatability fallback.

##Dependencies

Hemulen.js depends on these browser APIs: 

- [Drag and drop DOM events](http://www.w3.org/TR/2011/WD-html5-20110113/dnd.html#dnd);
- [File API](http://www.w3.org/TR/FileAPI/):
    - [File List](http://www.w3.org/TR/FileAPI/#filelist-section),
    - [File Object](http://www.w3.org/TR/FileAPI/#dfn-file).

Test for these APIs before instantiating the `Hemulen` class. A recommended means of testing is the [Modernizr](http://modernizr.com/) library. Modernizr core tests for drag and drop events. A test for the file API is among Modernizr's optional non-core detects.

##Browser Compatability

- Chrome 31+
- FireFox 35+
- IE 10+
- Safari 7.1+

##Basic Use

    <form action="/hemulen-form" method="post" enctype="multipart/form-data">
        <div class="foo">
            <div class="foo__drop-field"></div>
        </div>
        <input type="submit" />
    </form>
    
    
    <script type="text/javascript" src="hemulen.js"></script>
    
    <script>
        var foo = new Hemulen({
            dropInput: '.foo__drop-field',
            hemulenEl: '.foo',
            namespace: 'foo'
        });
    </script>


##Configuration

`new Hemulen(config);`

The `Hemulen` constructor expects a single argument: a configuration object. There are three required configuration properties and several optional configuration properties.

###Required

####dropInput

`config.dropInput`

Type: CSS selector string

A CSS selector identifying the drag&#45;and&#45;drop field. `config.dropInput` must be a descendant of `config.hemulenEl`.

####hemulenEl

`config.hemulenEl`

Type: CSS selector string

A CSS selector identifying the element containing `config.dropInput` and (optionally) `config.fileInput`.

####namespace

`config.namespace`

Type: String
 
A string used to identify a Hemulen instance when posting data to the server. Multiple `Hemulen` instances for a single form must each be given a unique namespace. See the "Send data to the server" section of the Hemulen.js overview for more information about the significance and utility of `config.namespace`.

###Optional

####acceptTypes

`config.acceptTypes`

Type: Array of mime-type strings

Validate by file type. When validation fails, the Hemulen element will emit the `hemulen-wrongtype` event. If the `Hemulen` class is instantiated without `config.acceptTypes`, the instance will accept any file type.

####beforeSub

`config.beforeSub(event, instance)`

Type: Function

A callback executed after the submit event is registered but before the data is sent to the server. If a form contains multiple Hemulen instances, the `beforeSub` of each instance will be called in the order of instantiation. `beforeSub` is called with two arguments:

- `event`: the submit event
- `instance`: the `Hemulen` instance on which `beforeSub` is defined. To call a Hemulen API method within `beforeSub`, reference `instance`, e.g. `instance.addData()`.

####fileLimit

`config.fileLimit`

Type: Number

Limit the number of files a drag&#45;and&#45;drop field will accept. A user can drop files multiple times until this limit is reached. If a user attempts to drop a group of files whose number exceeds the limit (or the remaining limit if files have been dropped already), no files will be accepted and the Hemulen element will emit the `hemulen-toomany` event.

####fileMaxSize

`config.fileMaxSize`

Type: Number

The number of bytes to use as the file size limit. If a file exceeds this limit, the Hemulen element will emit the `hemulen-toobig` event. If the `Hemulen` class is instantiated without `options.fileMaxSize`, the instance will not validate by file size. 


##Events

Hemulen events are DOM events. In addition to the properties and methods common to DOM events, a Hemulen event object contains Hemulen-specific values stored on the `event` object.

###General Events

####File Deleted

Event Name: `hemulen-filedeleted`

The event emitted by the Hemulen element when a file is removed from the data model. 

Event properties:

- `hemulen-filedeleted.hemulen`:
    + Type: Object,
    + The `Hemulen` class instance bound to the Hemulen element emitting the event;
- `hemulen-filedeleted.hemulenElId`:
    + Type: String,
    + The Hemulen storage key identifying the Hemulen element emitting the event.

####File Stored

Event Name: `hemulen-filestored`

The event emitted by the Hemulen element when a file is dropped on the drag&ndash;and&ndash;drop field and successfully stored on the data model.

Event properties:

- `hemulen-filestored.hemulen`
    + Type: Object
    + The `Hemulen` class instance bound to the Hemulen element emitting the event.
- `hemulen-filestored.hemulenElId`
    + Type: String
    + The Hemulen storage key identifying the Hemulen element emitting the event.
- `hemulen-filestored.file`
    + Type: File Object
    + The file object that has been successfully stored on the data model.
- `hemulen-filestored.fileId`
    + Type: String
    + The key under which the file has been stored on the data model. **`fileId` should be stored for later use.** Without the value of `fileId`, the file cannot be removed from the data model or updated with additional properties. Unlike the `hemulenElId`, there is no method to query the data model for a `fileId`. A file whose `fileId` is unknown to the application is stranded on the data model.

###Error Events

####Too Many Files

Event Name: `hemulen-toomany`

The event emitted by the Hemulen element when the number of files dropped on the drop input is greater than the value of `options.fileLimit`. When `hemulen-toomany` is emitted, none of that group of files have been stored on the data model.

Properties:

- `hemulen-toomany.hemulen`
    + Type: Object
    + The `Hemulen` class instance bound to the Hemulen element emitting the event.
- `hemulen-toomany.hemulenElId`
    + Type: String
    + The Hemulen storage key identifying the Hemulen element emitting the event.
- `hemulen-toomany.files`
    + Type: File List
    + The group of files that triggered the event.

####Invalid Files

Event Name: `hemulen-invalid`

The event emitted by the Hemulen element when one or more invalid files have been dropped on the drag&ndash;and&ndash;drop field. Invalid files have not been stored on the data model.

Dropping a file on a drag&ndash;and&ndash;drop field can produce multiple errors. The event is emitted once per user action and  the `hemulen-invalid.errors` property contains all errors produced by that action. 

Event properties:

- `hemulen-invalid.hemulen`
    + Type: Object
    + The `Hemulen` class instance bound to the Hemulen element emitting the event.
- `hemulen-invalid.hemulenElId`
    + Type: String
    + The Hemulen storage key identifying the Hemulen element emitting the event.
- `hemulen-invalid.hemulenErrors`:
    + Type: Array,
    + An array of objects. Each object represents an error. Each object has two properties:
        * `errorType`:
            - Type: String,
            - One of two error types:
                + `'too big'`: the file is greater than the value of `config.maxFileSize`;
                + `'too many'`: the file does not match any of the mime type strings stored in `config.accepTypes`.
        * `file`:
            - Type: File Object,
            - The invalid file.

###Form Submission Events

####Submission Success

Event Name: `hemulen-subsuccess`

Properties

- `hemulen-subsuccess.hemulenRequest`
    + Type: XMLHttpRequest object
    + The POST request made when the form is submitted.

####Submission Failure

Event Name: `hemulen-subfailure`

Properties

- `hemulen-subfailure.hemulenRequest`
    + Type: XMLHttpRequest object
    + The POST request made when the form is submitted.

##API

Hemulen API methods can be called by an instance of the `Hemulen` class.

###addData

`Hemulen.prototype.addData(hemulenElId, fileId, data)`

Associate one or more values with a stored file.

Parameters:

- `hemulenElId`:
    + Type: String,
    + a Hemulen storage key identifying an element to which the Hemulan instance is bound;
- `fileId`: 
    + Type: String,
    + a Hemulen storage key identifying the file with which the `data` will be associated;
- `data`: 
    + Type: Object,
    + an object containing values to be associated with the stored file. The values must be primitives.

###deleteFile

`Hemulen.prototype.deleteFile(hemulenElId, fileId)`

Removes a file and all associated data from the data model. If the file is removed successfully, the `hemulen-filedeleted` event is emitted.

Parameters:

- `hemulenElId`: 
    + Type: String,
    + a Hemulen storage key identifying an element to which the Hemulan instance is bound;
- `fileId`: 
    + Type: String,
    + a Hemulen storage key identifying the file to be removed from storage.


###destroy

`Hemulen.prototype.destroy(hemulenElId)`

Removes Hemulen event listeners from Hemulen element and delete files associated with that element in Hemulen storage. If the Hemulen instance is not bound to any other elements and there are no other Hemulen instances, `Hemulen.prototype.destroy` removes event listeners from the form. 

Parameters:

- `hemulenElId`
    + Type: String,
    + a Hemulen storage key identifying an element to which the Hemulan instance is bound;

###getHemulenElId

`Hemulen.prototype.getHemulenElId(element)`

Returns the key identifying `element` on the data model.

Parameters:

- `element`: 
    + Type: Element Node,
    + the element to which the Hemulen instance is bound.

###storeFiles

`Hemulen.prototype.storeFiles(hemulenElId, files)`

Stores each item of `files` on the data model. When `Hemulen.storeFiles()` is called, the Hemulen instance will emit events as if the files had been dropped on the drag&ndash;and&ndash;drop field.

Parameters:

- `hemulenElId`: 
    + Type: String,
    + a Hemulen storage key identifying an element to which the Hemulan instance is bound;
- `files`:
    + Type: FileList Object
    + a `FileList` containing one or more `File` objects.



