var filterIsOn = false;

$(function() {

	$("#start, #end").mask("99.99.9999", {placeholder: "__.__.____" });
	renderFilesList();
	$('.file-filter__button__apply').click(function() {
		filterIsOn = true;
		renderFilesList();
	});
	$('.file-filter__button__clear').click(function() {
		filterIsOn = false;
		renderFilesList();
	});
	$("#upload-file-input").change(uploadFile);
});

function renderFilesList()
{
	var fileTemplateRaw = $('#file-template').html();
	var fileTemplate = Handlebars.compile(fileTemplateRaw);  
	var filesList = $('#files-list');

	$('#files-list').empty();

	var filesForOutput = [];
	if (filterIsOn) {
		filesForOutput = filesAfterFilter();
	} else {
		filesForOutput = files;
	}

	$.each(filesForOutput, function(index, file) {
		filesList.append(fileTemplate(file));
	});

	// Добавляем обработчики на нажание кнопки "удалить"
	$('.file-description__btn--delete').click(function(event) {
		var fileId = $(event.currentTarget).data("id");
		deleteFile(fileId);
	});

	fillTypeFilterOptions();
}

function deleteFile(fileId)
{
	$.each(files, function(index, file) {
		if (file.id === fileId) {
			files.splice(index, 1);

			return false;
		}
	});

	renderFilesList();
}

function fillTypeFilterOptions()
{
	var fileFilterTemplateRaw = $('#file-filter-template').html();
	var fileFilterTemplate = Handlebars.compile(fileFilterTemplateRaw);  
	var filesFilterElement = $('.file-filter__type__input');

	var uniqueFormats = {all: 'Все'};
	$.each(files, function(fileId, file) {
		uniqueFormats[file.format] = file.format;
	});

	filesFilterElement.empty();
	$.each(uniqueFormats, function(format, title) {
		filesFilterElement.append(fileFilterTemplate({format: format, title: title}));
	});
}

function filesAfterFilter()
{
	var filesFilterElement = $('.file-filter__type__input');
	var selectedFormat = filesFilterElement.val();

	if ((filterIsOn === false) || (selectedFormat === 'all')) {
		return files;
	}

	var filteredFiles = [];

	$.each(files, function(fileId, file) {
		if (file.format == selectedFormat) {
			filteredFiles.push(file);
		}
	});

	return filteredFiles;
}

function uploadFile(event)
{
	var file = this.files[0];
	var fileNamePaths = file.name.split('.');
	var fileExt = fileNamePaths.pop();

	var fileName = fileNamePaths.join();
	var dateDownload = new Date();
	var dateStore = new Date();
	dateStore.setDate(dateStore.getDate() + 30);

	files.push({
		id: makeFileId(),
		format: fileExt,
		date_download: formatDate(dateDownload),
		date_store: formatDate(dateStore),
		name: fileName,
		size: Math.round(file.size / 1024 / 1024 * 10) / 10 + 'M',
		author: "No name"
	});

	renderFilesList();
}

function formatDate(date)
{
	var day = date.getDate().toString().length < 2 ? '0'.concat(date.getDate()) : date.getDate();
	var month = date.getMonth().toString().length < 2 ? '0'.concat(date.getMonth()) : date.getMonth();

	return day + '.' + month + '.' + date.getYear();
}

function makeFileId(length = 4)
{
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}