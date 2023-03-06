# CHANGE LOG

## 0.3.0
 - switched from gulp to webpack
 - complete code reorder
 - added flow
 - added babel

### breaking
The browser target is now jsonOdm in general.

```js
// old
jsonOdm.addSource("mySource",[],true);
let collection = jsonOdm.Collection("mySource");

// new
jsonOdm.JsonOdm.addSource("mySource",[],true);
let collection = jsonOdm.Collection("mySource");
```