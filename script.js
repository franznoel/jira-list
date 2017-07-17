(function() {
    var ticket = {
        issues: null,
        platform: function(key) {
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
        },
        className: function (status) {
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
        },
        version: function(version) {
            return (version.length >= 1) ? version[0].name : '';
        },
        priority: function(priority) {
            switch(priority) {
                case "1":
                    return '2 Highest';
                case "2":
                    return '3 High';
                case "3":
                    return '4 Medium';
                case "4":
                    return '5 Low';
                case "5":
                    return '6 Lowest';
                default:
                    return '1 Blocker';
            }
        },
        timeEstimate: function(time) {
            if (time === null) return "";
            return Math.floor(time/(3600)) + " hours";
        },
        refresh: function() {
            var self = this,
                url = 'https://privemd.atlassian.net/rest/api/2/search',
                jql = '?jql=project%20in%20(PAND%2C%20PANDP%2C%20PIOS%2C%20PIOSP%2C%20PWEB)%20AND%20Sprint%20in%20(openSprints())',
                fields = '&fields=fixVersions,priority,summary,status,timeestimate',
                startAt = '&startAt=0',
                maxResults = '&maxResults=200',
                query = url+jql+fields+startAt+maxResults;

            $.ajax({
              url: query,
              type: 'GET',
              beforeSend: function(xhr){
                  xhr.setRequestHeader('Authorization', 'Basic ZnRhbmdsYW86VGlkdXMjITEyMw==');
                  xhr.setRequestHeader('Content-Type', 'application/json');
              },
              success: function(response) {
                self.issues = response.issues;

                $('#total-issues').html('Total Issues: '+ self.issues.length);
                // console.log(issues);

                var html = '';
                self.issues.forEach(function(issue) {
                    var versionName = self.version(issue.fields.fixVersions),
                        priority = self.priority(issue.fields.priority.id),
                        platform = self.platform(issue.key),
                        className = self.className(issue.fields.status.name)
                        hours = self.timeEstimate(issue.fields.timeestimate);

                    html+='<tr onclick="window.open(\'https://privemd.atlassian.net/browse/'+ issue.key +'\')" class="'+ className +'">';
                    html+='<td>'+ issue.key +'</td>';
                    html+='<td>'+ priority +'</td>';
                    html+='<td>'+ platform +'</td>';
                    html+='<td>'+ issue.fields.summary +'</td>';
                    html+='<td>'+ versionName +'</td>';
                    html+='<td>'+ hours +'</td>';
                    html+='<td>'+ issue.fields.status.name +'</td>';
                    html+='</tr>';
                });
                $('#issues tbody').html('');
                $('#issues tbody').append(html);
              },
              error: function(response) {
                console.log("Error!");
                // console.log('Error:', response);
              }
            });
        }
    }

    $('#refresh-data').click(function() {
        ticket.refresh();
    });

    ticket.refresh();
})();



