$(document).ready(function () {
  //click input field on click on reference div
  $("#inputRef").click(function (e) {
    e.preventDefault();
    $("#images").click();
  });

  var zip = null;

  $("#images").change(function (e) {
    //change input_message on change
    $(".input_message").text(e.target.files.length + " image selected");

    //enable submit button
    $("#proceed").attr("disabled", false);

    //initialize zip
    zip = new JSZip();

    var images = e.target.files;
    /**
     * images will be zipped inside the image-file directory
     */
    var image_folder = zip.folder("image-file");

    for (let image of images) {
      image_folder.file(image.name, image);
    }

  });

  //start zipping on submit
  $("#selectImages").submit(function (e) {
    e.preventDefault();
    /**
     * show progress bar
     */
    $(".progress").css("visibility", "visible");

    /**
     * disble submit again so it can't be pressed when 
     * zipping is in progress
     */
    $("#proceed").attr("disabled", true);

    zip.generateAsync({
      type: 'blob'
    }, function (metadata) {
      var msg = "progress : " + metadata.percent.toFixed(2) + " %";
      if (metadata.currentFile) {
        msg += ", currently zipping : " + metadata.currentFile;
      }

      showMessage(msg);
      updatePercent(metadata.percent | 0)
    }).then(function (content) {
      //enable submit button
      $("#proceed").attr("disabled", false);
      
      /**
       * download zip file as image-file.zip when it ready
       */
      saveAs(content, "image-file.zip");
      /**
       * hide progress bar
       */
      $(".progress").css("visibility", "hidden");
      $("#progress_bar").addClass("hide").find(".progress-bar").attr("aria-valuenow", 0)
        .css({
          width: "0%"
        });

      showMessage("done !");
    }, function (e) {
      showError(e);
    });
  });

  /**
   * Reset the message.
   */
  function resetMessage() {
    $("#result").removeClass().text("");
  }

  /**
   * show a successful message.
   */
  function showMessage(text) {
    resetMessage();
    $("#result").addClass("alert alert-success").text(text);
  }

  /**
   * show an error message.
   */
  function showError(text) {
    resetMessage();
    $("#result").addClass("alert alert-danger").text(text);
  }

  /**
   * Update the progress bar.
   */
  function updatePercent(percent) {
    $("#progress_bar").removeClass("hide").find(".progress-bar").attr("aria-valuenow", percent)
      .css({
        width: percent + "%"
      });
  }
});