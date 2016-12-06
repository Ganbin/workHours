export class TruncateValueConverter {
  toView(text, length, end) {
      if(text !== undefined && text !== null) {
          if(isNaN(length)) {
              length = 10;
          }
          end = end || "...";
          if(text.length <= length || text.length - end.length <= length) {
              return text;
          } else {
              return String(text).substring(0, length - end.length) + end;
          }
      }
  };
}
