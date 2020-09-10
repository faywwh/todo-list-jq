class Modal {
  constructor(config) {
    // 空判断处理
    config = config || {};
    this.title = config.title || '';
    this.content = config.content || '';
    this.width = parseInt(config.width, 10) || 600;
    this.cancelText = config.cancelText || '取消';
    this.confirmText = config.confirmText || '确认';
    this.cancelFunc = config.cancelFunc;
    this.confirmFunc = config.confirmFunc;
    // 初始化
    this._modalMask = null;
    this.init();
  }

  init() {
    this.initModal();
  }

  initModal() {
    var documentHeight =
      document.documentElement.clientHeight || document.body.clientHeight;
    var modalDialog = document.createElement('div');
    var modalContent = document.createElement('div');
    var modalHeader = document.createElement('div');
    var modalTitle = document.createElement('div');
    var modalClose = document.createElement('span');
    var modalBody = document.createElement('div');
    var modalFooter = document.createElement('div');
    var buttonCancel = document.createElement('button');
    var buttonConfirm = document.createElement('button');
    this._modalMask = document.createElement('div');
    // 添加标题和关闭按钮
    modalTitle.innerText = this.title;
    modalTitle.className = 'modal-title';
    modalClose.innerText = '×';
    modalClose.className = 'modal-close';
    modalHeader.className = 'modal-header';
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(modalClose);
    // 添加内容
    modalBody.innerHTML = this.content;
    modalBody.className = 'modal-body';
    // 添加底部内容
    buttonCancel.type = 'button';
    buttonCancel.className = 'btn btn-cancel';
    buttonCancel.innerText = this.cancelText;
    buttonCancel.onclick = (e) => {
      // 取消按钮回调
      if (this.cancelFunc && typeof this.cancelFunc === 'function') {
        this.cancelFunc();
      }
    };
    buttonConfirm.type = 'button';
    buttonConfirm.className = 'btn btn-confirm';
    buttonConfirm.innerText = this.confirmText;
    buttonConfirm.onclick = (e) => {
      // 确认按钮回调
      if (this.confirmFunc && typeof this.confirmFunc === 'function') {
        this.confirmFunc();
      }
    };
    modalFooter.className = 'modal-footer';
    modalFooter.appendChild(buttonCancel);
    modalFooter.appendChild(buttonConfirm);
    // 将modal插入到body
    modalContent.className = 'modal-content';
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modalDialog.className = 'modal-dialog';
    modalDialog.style.width = this.width + 'px';
    modalDialog.appendChild(modalContent);
    this._modalMask.className = 'modal-mask';
    // 关闭处理进行事件委托
    this._modalMask.onclick = (e) => {
      var className = e.target.className;
      var classNameList = [
        'modal-mask',
        'modal-close',
        'btn btn-cancel',
        'btn btn-confirm',
      ];
      if (classNameList.indexOf(className) >= 0) {
        this.close();
      }
    };
    this._modalMask.appendChild(modalDialog);
    document.body.appendChild(this._modalMask);
    // 动态添加modalBody最大高度
    modalBody.style.maxHeight =
      documentHeight -
      modalHeader.clientHeight -
      modalFooter.clientHeight -
      180 +
      'px';
  }
  // 关闭按钮函数
  close() {
    this._modalMask.style.display = 'none';
  }
  show() {
    this._modalMask.style.display = 'block';
  }
}
