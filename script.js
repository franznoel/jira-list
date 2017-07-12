(function() {

    var getPlatform = function(key) {
        var project = key.substring(0,5);
        switch(project) {
            case 'PWEB-':
                return 'Android Doctor';
            case 'PANDP':
                return 'Android Patient';
            case 'PAND-':
                return 'Android Doctor';
            case 'PIOS-':
                return 'iOS Doctor';
            case 'PIOSP':
                return 'iOS Patient';
            default:
                return '';
        }
    }

    var getClass = function (status) {
        switch(status) {
            case 'Done':
                return 'alert alert-success';
            case 'QA':
            case 'Development':
            case 'In Progress':
                return 'alert alert-warning';
            default:
                return '';
        }
    }


    $.ajax({
      url: 'https://privemd.atlassian.net/rest/api/2/search?jql=project%20in%20(PAND,%20PANDP,%20PIOS,%20PIOSP,%20PWEB)%20ORDER%20BY%20lastViewed%20DESC', //https://privemd.atlassian.net/rest/api/2/project
      type: 'GET',
      beforeSend: function(xhr){
          xhr.setRequestHeader('Authorization', 'Basic ZnRhbmdsYW86VGlkdXMjITEyMw==');
          xhr.setRequestHeader('Content-Type', 'application/json');
      },
      success(response) {
        var issues = response.issues;
        console.log(issues);
        var html = '';
        issues.forEach(function(issue) {
            html+='<tr onclick="window.open(\'https://privemd.atlassian.net/browse/'+ issue.key +'\')" class="'+ getClass(issue.fields.status.name) +'">';
            html+='<td>'+ issue.key +'</td>';
            html+='<td>'+ getPlatform(issue.key); +'</td>';
            html+='<td>'+ issue.fields.summary +'</td>';
            html+='<td>'+ issue.fields.status.name +'</td>';
            html+='<td></td>';
            html+='</tr>';
        });
        $('#issues tbody').append(html);
        // response.issues()
        // console.log('Success:', response.issues);
      },
      error(response) {
        console.log("Error!");
        // console.log('Error:', response);
      }
    });

})();



