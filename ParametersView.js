define([
    'R2CIQ/Filtering/Views/DatePickerView',
    'R2CIQ/Controls/Views/NumericInput',
    'R2CIQ/Filtering/Views/ListView',
    'R2CIQ/Filtering/Views/InputTextView',
    'R2CIQ/Common/Enums',
    'R2CIQ/Utils/Binders'
  ],
  function(
    DatePickerView,
    NumericInput,
    ListView,
    InputTextView,
    EnumsCommon,
    Binders
  ) {
    return Backbone.View.extend({
      tagName: 'span',

      initialize: function(options) {
        Binders.all(this);
        this.keyProperty = options.keyProperty;
        this.valueProperty = options.valueProperty;
      },

      render: function() {
        if (!this.model) {
          return this;
        }

        var numberOfArguments = this.model.get('NumberOfArguments');
        var type = this.model.get('Type');

        if (this.options.validValues && this.options.validValues.length > 0 && numberOfArguments > 0) {
          var validValuesView = new ListView({
            index: 0,
            collection: this.options.validValues,
            selected: (this.options.values) ? this.options.values[0] : "",
            attributes: {
              model: "arguments"
            },
            keyProperty: this.keyProperty,
            valueProperty: this.valueProperty
          });
          this.$el.append(validValuesView.render().el);
          return this;
        }

        switch (type) {
          case EnumsCommon.MetricDataType.Number:
            for (var i = 0; i < numberOfArguments; i++) {
              var userNumericInputView = new NumericInput({
                attributes: {
                  model: "arguments",
                  type: "text"
                },
                index: i,
                value: (this.options.values) ? this.options.values[i] : ""
              });
              this.$el.append(userNumericInputView.render().el);
              if (i < numberOfArguments - 1) {
                this.$el.append(" &amp; ");
              }
            }
            break;
          case EnumsCommon.MetricDataType.Date:
            if (numberOfArguments == 1) {
              var userDateInputView = new DatePickerView({
                index: 0,
                value: (this.options.values) ? this.options.values[0] : ""
              });
              this.$el.append(userDateInputView.render({
                dateFormat: 'yy-mm-dd',
                changeMonth: true,
                changeYear: true
              }).el);
            } else if (numberOfArguments == 2) {
              var userDateInputViewFrom = new DatePickerView({
                index: 0,
                value: (this.options.values) ? this.options.values[0] : ""
              });
              this.$el.append(userDateInputViewFrom.render({
                dateFormat: 'yy-mm-dd',
                changeMonth: true,
                changeYear: true,
                onClose: function(selectedDate) {
                  $(userDateInputViewTo.el).datepicker("option", "minDate", selectedDate);
                }
              }).el);
              this.$el.append("<span> &amp; </span>");
              var userDateInputViewTo = new DatePickerView({
                index: 1,
                value: (this.options.values) ? this.options.values[1] : ""
              });
              this.$el.append(userDateInputViewTo.render({
                dateFormat: 'yy-mm-dd',
                changeMonth: true,
                changeYear: true,
                onClose: function(selectedDate) {
                  $(userDateInputViewFrom.el).datepicker("option", "maxDate", selectedDate);
                }
              }).el);
            }
            break;
          case EnumsCommon.MetricDataType.Boolean:
            if (numberOfArguments !== 0) {
              var yesValue = new Backbone.Model({
                Key: "1",
                Value: "True"
              });
              var noValue = new Backbone.Model({
                Key: "0",
                Value: "False"
              });
              var yesnoValues = new Backbone.Collection([yesValue, noValue]);
              var yesnoView = new ListView({
                index: 0,
                collection: yesnoValues,
                selected: (this.options.values) ? this.options.values[0] : "",
                attributes: {
                  model: "arguments"
                },
                keyProperty: 'Key',
                valueProperty: 'Value'
              });
              this.$el.append(yesnoView.render().el);
            }
            break;
          default:
            for (var j = 0; j < numberOfArguments; j++) {
              var userStringInputView = new InputTextView({
                index: j,
                value: (this.options.values) ? this.options.values[j] : ""
              });
              this.$el.append(userStringInputView.render().el);
              if (j < numberOfArguments - 1) {
                this.$el.append("<span> &amp; </span>");
              }
            }
            break;
        }

        return this;
      }
    });
  });