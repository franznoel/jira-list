(function() {
    var Issue = function(issue) {
        var issueObject = {
            issue: issue,
            platform: function() {
                var project = this.issue.key.substring(0,5);
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
            className: function () {
                switch(this.issue.fields.status.name) {
                    case 'Done':
                        return 'success';
                    case 'QA':
                    case 'Development':
                    case 'Building':
                    case 'In Progress':
                        return 'warning';
                    case 'Clarification':
                        return 'info';
                    case 'Failed':
                        return 'danger';
                    default:
                        return '';
                }
            },
            version: function() {
                var versions = this.issue.fields.fixVersions;
                if (versions.length === null) return '';

                var versionHtml = '';

                versions.forEach(function(version) {
                    versionHtml+= '<span class="label label-warning">' + version.name + '</span>';
                });

                return versionHtml;
            },
            priority: function() {
                switch(this.issue.fields.priority.id) {
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
            timeEstimate: function() {
                var time = this.issue.fields.timeestimate;
                if (time === null) return "";
                return Math.floor(time/(3600)) + " hours";
            },
            assignee: function() {
                if (this.issue.fields.assignee === null) return '';
                return this.issue.fields.assignee.displayName;
            },
            displayIssue: function() {
                var html = '',
                    versionName = this.version(),
                    priority = this.priority(),
                    platform = this.platform(),
                    className = this.className(),
                    assignee = this.assignee(),
                    hours = this.timeEstimate();

                html+='<tr onclick="window.open(\'https://privemd.atlassian.net/browse/'+ issue.key +'\')" class="'+ className +'">';
                html+='<td>'+ issue.key +'</td>';
                html+='<td>'+ priority +'</td>';
                html+='<td>'+ platform +'</td>';
                html+='<td>'+ this.issue.fields.summary +'</td>';
                html+='<td>'+ versionName +'</td>';
                html+='<td>'+ hours +'</td>';
                html+='<td>'+ assignee +'</td>';
                html+='<td>'+ this.issue.fields.status.name +'</td>';
                html+='</tr>';

                return html;
            }
        };

        return issueObject;
    };

    var Credentials = {
        getSavedCredential: function() {
            return localStorage.getItem('credentials');
        },

        set: function() {
            var username = $('#username').val(),
                password = $('#password').val();

            if (username !== '' && password !== '') {
                localStorage.setItem('credentials', btoa(username+':'+password));
            }
        },

        exists: function() {
            // console.log('Does it exists?');
            return (!this.getSavedCredential()) ? false : true;
        }


    }


    var issues = {
        url: 'https://privemd.atlassian.net/rest/api/2/search',
        jql: '?jql=project%20in%20(PAND%2C%20PANDP%2C%20PIOS%2C%20PIOSP%2C%20PWEB)%20AND%20Sprint%20in%20(openSprints())',
        fields: '&fields=fixVersions,priority,summary,status,timeestimate,assignee',
        startAt: '&startAt=0',
        maxResults: '&maxResults=200',

        query: function() {
            return this.url + this.jql + this.fields + this.startAt + this.maxResults;
        },

        displayAllIssues: function(response) {
            var issueHtml = '';
            response.issues.forEach(function(issue) {
                var issueObject = new Issue(issue);
                issueHtml+= issueObject.displayIssue();
            });
            $('#issues tbody').html('');
            return issueHtml;
        },

        refresh: function(credentials) {
            var self = this;

            if (Credentials.exists()) {
                // console.log('Exists!');
                // Load issues
                $.ajax({
                  url: self.query(),
                  type: 'GET',
                  beforeSend: function(xhr){
                      xhr.setRequestHeader('Authorization', 'Basic ' + Credentials.getSavedCredential());
                      xhr.setRequestHeader('Content-Type', 'application/json');
                  },
                  success: function(response) {
                    self.issues = response.issues;
                    var issueHtml = self.displayAllIssues(response);
                    $('#total-issues').html('Total Issues: '+ self.issues.length);
                    $('#issues tbody').append(issueHtml);
                  },
                  error: function(response) {
                    console.log("Error!");
                    $('#issues tbody').html('<tr class="danger"><td colspan="8" style="text-align:center;">You entered the wrong credentials. Please enter again.</td></tr>');
                  }
                });
            } else {
                console.log('No credentials!');
                Credentials.set();
                if (Credentials.exists()) {
                    this.refresh();
                }
            }


        }
    };

    $('#refresh-data').click(function() {
        // console.log('Refresh');
        issues.refresh();
    });

    // console.log('Load');
    issues.refresh();
})();



