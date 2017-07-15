(function() {

    var getPlatform = function(key) {
        var project = key.substring(0,5);
        switch(project) {
            case 'PWEB-':
                return 'Web Dispatch';
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
    };

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
    };

    var getVersion = function(version) {
        return (version.length >= 1) ? version[0].name : '';
    }

    var getPriority = function(priority) {
        switch(priority) {
            case "1":
                return 'Highest';
            case "2":
                return 'High';
            case "3":
                return 'Medium';
            case "4":
                return 'Low';
            case "5":
                return 'Lowest';
            default:
                return 'Blocker';
        }
    }

    var getTimeEstimate = function(time) {
        if (time === null) return "";
        return Math.floor(time/(3600)) + " hours";
    }

    setInterval(function() {
        $.ajax({
          url: 'https://privemd.atlassian.net/rest/api/2/search?jql=project%20in%20(PAND%2C%20PANDP%2C%20PIOS%2C%20PIOSP%2C%20PWEB)%20AND%20Sprint%20in%20(openSprints())', //https://privemd.atlassian.net/rest/api/2/project
          type: 'GET',
          beforeSend: function(xhr){
              xhr.setRequestHeader('Authorization', 'Basic ZnRhbmdsYW86VGlkdXMjITEyMw==');
              xhr.setRequestHeader('Content-Type', 'application/json');
          },
          success(response) {
            var issues = response.issues;

            // console.log(issues);
            var html = '';
            issues.forEach(function(issue) {
                var versionName = getVersion(issue.fields.fixVersions),
                    priority = getPriority(issue.fields.priority.id),
                    hours = getTimeEstimate(issue.fields.timeestimate);

                html+='<tr onclick="window.open(\'https://privemd.atlassian.net/browse/'+ issue.key +'\')" class="'+ getClass(issue.fields.status.name) +'">';
                html+='<td>'+ issue.key +'</td>';
                html+='<td>'+ priority +'</td>';
                html+='<td>'+ getPlatform(issue.key) +'</td>';
                html+='<td>'+ issue.fields.summary +'</td>';
                html+='<td>'+ versionName +'</td>';
                html+='<td>'+ hours +'</td>';
                html+='<td>'+ issue.fields.status.name +'</td>';
                html+='</tr>';
            });
            $('#issues tbody').html('');
            $('#issues tbody').append(html);
          },
          error(response) {
            console.log("Error!");
            // console.log('Error:', response);
          }
        });
    },1000);

})();



