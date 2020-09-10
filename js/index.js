var dataList = [];
var curIndex = '';
var modal = new Modal({
  content: '<textarea class="form-control" rows="3"></textarea>',
  confirmFunc: addDetailText,
});

$(document).ready(function () {
  initTask();
});

// 初始化
function initTask() {
  dataList = getLocalStorage('todoList') || [];
  $.each(dataList, function (index, item) {
    addTask(index, item);
  });
}

// 输入文本
function inputText() {
  if (!$('.task-text').val()) {
    alert('请输入事件！');
  } else if ($('.task-text').val().length > 20) {
    alert('输入文本过长！');
  } else {
    var dataObj = {
      title: $('.task-text').val(),
      detailText: '',
      remindTime: '',
      status: 0,
      timer: null,
    };
    dataList.push(dataObj);
    setLocalStorage('todoList', dataList);
    addTask(dataList.length - 1, dataObj);
    $('.task-text').val('');
  }
}

// 增加事件
function addTask(index, item) {
  // 初始化状态
  var statusText = '';
  var td1ClassName = '';
  var statusClassName = '';
  if (item.status == 0) {
    statusText = '未完成';
    td1ClassName = 'td1';
    statusClassName = 'status';
  } else if (item.status == 1) {
    statusText = '已完成';
    td1ClassName = "'td1 active'";
    statusClassName = "'status taskComplete'";
  }
  // 初始化设置提醒
  if (item.remindTime && +new Date(item.remindTime) <= +new Date()) {
    alert(item.title);
    item.remindTime = '';
    setLocalStorage('todoList', dataList);
  } else if (+new Date(item.remindTime) > +new Date()) {
    item.timer = setInterval(function () {
      if (+new Date(item.remindTime) <= +new Date()) {
        clearInterval(item.timer);
        item.timer = null;
        alert(item.title);
        item.remindTime = '';
        $('tbody .remindTime').eq(index).val('');
        setLocalStorage('todoList', dataList);
      }
    }, 1000);
  }
  // 插入dom
  var trHtml =
    '<tr class="tr" data-index=' +
    index +
    '><td class=' +
    td1ClassName +
    '>' +
    item.title +
    "</td><td class='td2'>" +
    item.detailText +
    "</td><td class='td3'><input type='text' value='" +
    item.remindTime +
    "' class='remindTime form-control' placeholder='例：2020/9/10 13:30'/></td>" +
    "<td class='td4'><button type='button' class='remindBtn' onclick='setRemind(event)'>设置提醒</button></td>" +
    "<td class='td5'><button type='button' class='deleteBtn' onclick='deleteTask(event)'>删除事件</button></td>" +
    "<td class='td6'><button type='button' class=" +
    statusClassName +
    " onclick='toggleStatus(event)'>" +
    statusText +
    '</button></td>' +
    "<td class='td7'><button type='button' class='detail' onclick='openMask(event)'>详情</button></td></tr>";
  $('.task-table tbody').append(trHtml);
}

// 设置提醒
function setRemind(e) {
  var nowTime = +new Date();
  var curIndex = $(e.target).parent().parent().attr('data-index');
  var remindTime = $(e.target).parent().parent().find('.remindTime').val();
  var remindTimeStamp = +new Date(remindTime);
  if (isNaN(remindTimeStamp)) {
    alert('格式错误，请重新输入！');
  } else if (remindTimeStamp <= nowTime) {
    alert('请确认提醒时间设置为当前时间之后！');
  }
  // 设置成功
  else {
    alert('已设置提醒时间');
    dataList[curIndex].remindTime = remindTime;
    setLocalStorage('todoList', dataList);
    if (dataList[curIndex].timer) {
      clearInterval(dataList[curIndex].timer);
    }
    dataList[curIndex].timer = setInterval(function () {
      if (remindTimeStamp <= +new Date()) {
        clearInterval(dataList[curIndex].timer);
        dataList[curIndex].timer = null;
        alert($(e.target).parent().parent().find('.td1').text());
        $('.remindTime').eq(curIndex).val('');
        dataList[curIndex].remindTime = '';
        setLocalStorage('todoList', dataList);
      }
    }, 1000);
    // 更新缓存的timer
    setLocalStorage('todoList', dataList);
  }
}

// 转换完成情况
function toggleStatus(e) {
  curIndex = $(e.target).parent().parent().attr('data-index');
  if (dataList[curIndex].status == 0) {
    dataList[curIndex].status = 1;
    $('tbody .status').eq(curIndex).text('已完成');
    $('tbody .td1').eq(curIndex).addClass('active');
    $('tbody .status').eq(curIndex).addClass('taskComplete');
    if ($('tbody .remindTime').eq(curIndex).val() && dataList[curIndex].timer) {
      clearInterval(dataList[curIndex].timer);
      $('tbody .remindTime').eq(curIndex).val('');
      dataList[curIndex].remindTime = '';
      dataList[curIndex].timer = null;
      setLocalStorage('todoList', dataList);
    }
  } else if (dataList[curIndex].status == 1) {
    dataList[curIndex].status = 0;
    $('tbody .status').eq(curIndex).text('未完成');
    $('tbody .td1').eq(curIndex).removeClass('active');
    $('tbody .status').eq(curIndex).removeClass('taskComplete');
  }
  setLocalStorage('todoList', dataList);
}

// // 打开遮罩层
// function openMask(e) {
//   curIndex = $(e.target).parent().parent().attr('data-index');
//   $('.overlay .title').text($('tbody .td1').eq(curIndex).text());
//   $('.overlay textarea').val(dataList[curIndex].detailText);
//   $('.overlay').fadeIn(300);
//   $('.detailArea').slideDown(200);
// }

// 删除事件
function deleteTask(e) {
  var confirmDel = confirm('请确认是否删除事件？');
  if (confirmDel) {
    curIndex = $(e.target).parent().parent().attr('data-index');
    $('.tr').eq(curIndex).remove();
    dataList.splice(curIndex, 1);
    setLocalStorage('todoList', dataList);
    $('.tr').each(function (index, item) {
      $(item).attr('data-index', index);
    });
  }
}

// 缓存数据
function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// 获取缓存数据
function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// 增加弹窗详情
function addDetailText() {
  dataList[curIndex].detailText = $('.modal-mask .form-control').val();
  setLocalStorage('todoList', dataList);
  $('tbody .td2').eq(curIndex).text(dataList[curIndex].detailText);
}

// 退出弹窗
// function closeMask() {
//   $('.overlay').fadeOut(300);
//   $('.detailArea').slideUp(200);
// }

// 输入框按enter输入
function keyDown(e) {
  if (e.keyCode == 108 || e.keyCode == 13) {
    inputText();
  }
}

// function closeMaskAll(e) {
//   var className = e.target.className;
//   var classNameList = ['overlay', 'confirmBtn', 'cancelBtn'];
//   if (classNameList.indexOf(className) >= 0) {
//     closeMask();
//   }
// }

function openMask(e) {
  curIndex = $(e.target).parent().parent().attr('data-index');
  $('.modal-title').text($('tbody .td1').eq(curIndex).text());
  $('.modal-mask .form-control').text(dataList[curIndex].detailText);
  modal.show();
}
